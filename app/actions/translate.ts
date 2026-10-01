'use server';

import { requireAdmin } from '@/lib/supabase/admin-guard';

export interface TranslatePostInput {
  title_gu: string;
  excerpt_gu?: string;
  content_gu: string;
}

export interface TranslatePostResult {
  success: boolean;
  data?: {
    title_en: string;
    excerpt_en: string;
    content_en: string;
  };
  warning?: string;
  error?: string;
}

export interface TranslatePrayerInput {
  title_gu: string;
  subtitle_gu?: string;
  content_gu: string;
}

export interface TranslatePrayerResult {
  success: boolean;
  data?: {
    title_en: string;
    subtitle_en: string;
    content_en: string;
  };
  warning?: string;
  error?: string;
}

class NonRetryableError extends Error {
  constructor(message: string, public readonly tryNextModel = false) {
    super(message);
    this.name = 'NonRetryableError';
  }
}

const SYSTEM_INSTRUCTION = `
You are an expert translator specializing in Gujarati spiritual, devotional, and cultural literature, specifically Pushtimarg and Vaishnav traditions.
Translate the provided Gujarati content into fluent, natural English with spiritual warmth and elegance.

CRITICAL RULES:
1. Sacred Terminology: Keep sacred names and traditional Pushtimarg/Vaishnav terms untranslated or respectfully transliterated (e.g. 'Shreeji Bawa', 'Shrinathji', 'Mahaprabhuji', 'Vallabhacharya', 'Pushtimarg', 'Yamunaji', 'Haveli', 'Darshan', 'Seva', 'Satsang', 'Manorath', 'Thakorji', 'Brahmasambandha', 'Sadhana', 'Bhakti', 'Kripa'). Do NOT replace them with generic or awkward literal translations.
2. HTML & Image Preservation: The content may contain HTML markup from a rich-text editor (such as <h2>, <h3>, <p>, <blockquote>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">, <img src="..." alt="..." />). You MUST PRESERVE all HTML tags, structure, attributes, and image src URLs EXACTLY. Only translate the human-readable text inside the elements. Do NOT drop, modify, or corrupt any HTML tags or image URLs.
3. Devotional Tone: Maintain a respectful, humble, and reverent tone suitable for devotees and readers seeking spiritual contemplation.
4. Output Format: Return strictly valid JSON matching the requested schema. Do NOT include markdown code blocks, backticks, or any conversational preamble.
`.trim();

const RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1200;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

function extractImageSources(html: string): string[] {
  const matches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  return Array.from(matches, (m) => m[1]);
}

function extractLinkHrefs(html: string): string[] {
  const matches = html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi);
  return Array.from(matches, (m) => m[1]);
}

function verifyHtmlIntegrity(guHtml: string, enHtml: string): string | undefined {
  const warnings: string[] = [];

  // 1. Check images
  const guImages = extractImageSources(guHtml);
  const enImages = extractImageSources(enHtml);
  const missingImages = guImages.filter((src) => !enImages.includes(src));
  if (missingImages.length > 0) {
    warnings.push(`${missingImages.length} image(s) from the original content may be missing or have modified URLs.`);
  }

  // 2. Check hyperlinks
  const guLinks = extractLinkHrefs(guHtml);
  const enLinks = extractLinkHrefs(enHtml);
  const missingLinks = guLinks.filter((href) => !enLinks.includes(href));
  if (missingLinks.length > 0) {
    warnings.push(`${missingLinks.length} hyperlink(s) may be missing in the translation.`);
  }

  // 3. Check major structural elements
  const structuralTags = ['h2', 'h3', 'blockquote', 'ul', 'ol'];
  for (const tag of structuralTags) {
    const guCount = (guHtml.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
    const enCount = (enHtml.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
    if (guCount > 0 && enCount === 0) {
      warnings.push(`Original <${tag}> structure was omitted in English.`);
    }
  }

  return warnings.length > 0 ? warnings.join(' ') : undefined;
}

async function callGeminiSingleModel(
  model: string,
  apiKey: string,
  prompt: string,
  schemaDescription: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const generationConfig: Record<string, unknown> = {
    temperature: 0.3,
    response_mime_type: 'application/json',
    maxOutputTokens: 16384,
  };

  // Only pass thinkingConfig for Gemini 2.5 models to prevent 400 Bad Request on older/other models
  if (model.toLowerCase().includes('2.5')) {
    generationConfig.thinkingConfig = {
      thinkingBudget: 0,
    };
  }

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${prompt}\n\nRespond strictly with valid JSON matching this schema:\n${schemaDescription}`,
          },
        ],
      },
    ],
    generationConfig,
  };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let parsedMessage = response.statusText;
        try {
          const errJson = JSON.parse(errorText);
          parsedMessage = errJson?.error?.message || response.statusText;
        } catch {
          parsedMessage = errorText || response.statusText;
        }

        // Model not found or bad request for specific model parameters should fail this model and try fallback
        if (response.status === 400 || response.status === 404) {
          throw new NonRetryableError(`Gemini error (${response.status}) on ${model}: ${parsedMessage}`, true);
        }

        // Authentication/authorization errors should abort without trying fallback models
        if (response.status === 401 || response.status === 403) {
          throw new NonRetryableError(`Gemini error (${response.status}) on ${model}: ${parsedMessage}`);
        }

        // Retry transient errors (429 rate limit or 5xx server issues)
        if ((response.status === 429 || response.status >= 500) && attempt < RETRY_ATTEMPTS) {
          await sleep(RETRY_DELAY_MS * attempt);
          continue;
        }

        throw new Error(`Gemini API error (${response.status}) on ${model}: ${parsedMessage}`);
      }

      const json = await response.json();
      const candidate = json?.candidates?.[0];

      // Check finishReason for truncation or safety filters
      if (candidate?.finishReason === 'MAX_TOKENS') {
        throw new NonRetryableError(
          'The translation was truncated because the article is too long. Please shorten the article or translate it in parts.'
        );
      }
      if (candidate?.finishReason === 'SAFETY') {
        throw new NonRetryableError('The translation request was stopped by Gemini safety filters.');
      }

      const parts = candidate?.content?.parts || [];
      const textOutput = parts
        .map((p: { text?: string }) => p.text || '')
        .join('')
        .trim();

      if (!textOutput) {
        throw new Error('Gemini returned an empty response.');
      }

      return cleanJsonResponse(textOutput);
    } catch (err) {
      if (err instanceof NonRetryableError) {
        throw err;
      }

      lastError = err instanceof Error ? err : new Error(String(err));
      // Retry transient network/fetch errors
      if (attempt < RETRY_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw lastError || new Error(`Failed to call Gemini model ${model}`);
}

async function callGemini(prompt: string, schemaDescription: string): Promise<string> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new NonRetryableError(
      'Gemini API Key is not configured. Please set GEMINI_API_KEY in your environment configuration.'
    );
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  // Fallback model list if the primary model fails or is unavailable
  const candidateModels = [primaryModel, 'gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'].filter(
    (val, idx, arr) => arr.indexOf(val) === idx
  );

  let lastError: Error | null = null;
  for (const model of candidateModels) {
    try {
      return await callGeminiSingleModel(model, apiKey, prompt, schemaDescription);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Non-retryable errors (e.g. auth, bad key, MAX_TOKENS, SAFETY) should stop immediately unless tryNextModel is set
      if (err instanceof NonRetryableError && !err.tryNextModel) {
        throw err;
      }
      console.warn(`Gemini model ${model} failed, attempting next fallback model...`, lastError.message);
    }
  }

  throw lastError || new Error('All Gemini translation models failed.');
}

export async function translatePostFields(
  input: TranslatePostInput
): Promise<TranslatePostResult> {
  const { error: authError } = await requireAdmin();
  if (authError) {
    return { success: false, error: authError };
  }

  if (!input.title_gu?.trim() && !input.content_gu?.trim()) {
    return {
      success: false,
      error: 'Please enter Gujarati title or content before requesting translation.',
    };
  }

  try {
    const prompt = `
Please translate the following Gujarati blog post fields to English:

<gujarati_title>
${input.title_gu || ''}
</gujarati_title>

<gujarati_excerpt>
${input.excerpt_gu || ''}
</gujarati_excerpt>

<gujarati_content>
${input.content_gu || ''}
</gujarati_content>
    `.trim();

    const schemaDescription = `{
  "title_en": "English title string",
  "excerpt_en": "English excerpt string (concise summary)",
  "content_en": "English HTML content with identical markup and image structure"
}`;

    const rawResult = await callGemini(prompt, schemaDescription);
    let parsed: { title_en?: string; excerpt_en?: string; content_en?: string };
    try {
      parsed = JSON.parse(rawResult);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', rawResult, parseErr);
      return {
        success: false,
        error: 'Gemini returned an invalid formatted response. Please try again.',
      };
    }

    const warning = verifyHtmlIntegrity(input.content_gu || '', parsed.content_en || '');

    return {
      success: true,
      data: {
        title_en: parsed.title_en || '',
        excerpt_en: parsed.excerpt_en || '',
        content_en: parsed.content_en || '',
      },
      warning,
    };
  } catch (err) {
    console.error('translatePostFields error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Translation failed',
    };
  }
}

export async function translatePrayerFields(
  input: TranslatePrayerInput
): Promise<TranslatePrayerResult> {
  const { error: authError } = await requireAdmin();
  if (authError) {
    return { success: false, error: authError };
  }

  if (!input.title_gu?.trim() && !input.content_gu?.trim()) {
    return {
      success: false,
      error: 'Please enter Gujarati title or prayer text before requesting translation.',
    };
  }

  try {
    const prompt = `
Please translate the following Gujarati devotional prayer/hymn/stotra fields to English:

SPECIAL PRAYER/SANSKRIT RULE:
For any Sanskrit verses, shlokas, or stotras written in Gujarati script:
1. Provide the Sanskrit verse in clear Roman/English transliteration (IAST or readable phonetic English).
2. Follow each verse with its clear, devotional English meaning/translation.

<gujarati_prayer_title>
${input.title_gu || ''}
</gujarati_prayer_title>

<gujarati_prayer_subtitle>
${input.subtitle_gu || ''}
</gujarati_prayer_subtitle>

<gujarati_prayer_content>
${input.content_gu || ''}
</gujarati_prayer_content>
    `.trim();

    const schemaDescription = `{
  "title_en": "English title string",
  "subtitle_en": "English subtitle / brief one-line description",
  "content_en": "English prayer/hymn text with transliterated Sanskrit verses followed by English devotional translation"
}`;

    const rawResult = await callGemini(prompt, schemaDescription);
    let parsed: { title_en?: string; subtitle_en?: string; content_en?: string };
    try {
      parsed = JSON.parse(rawResult);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', rawResult, parseErr);
      return {
        success: false,
        error: 'Gemini returned an invalid formatted response. Please try again.',
      };
    }

    return {
      success: true,
      data: {
        title_en: parsed.title_en || '',
        subtitle_en: parsed.subtitle_en || '',
        content_en: parsed.content_en || '',
      },
    };
  } catch (err) {
    console.error('translatePrayerFields error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Translation failed',
    };
  }
}
