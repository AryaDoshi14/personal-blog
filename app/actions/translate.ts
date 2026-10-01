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
  error?: string;
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
  // Strip opening markdown code fence if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  }
  // Strip closing code fence
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```\s*$/, '');
  }
  return cleaned.trim();
}

function extractImageSources(html: string): string[] {
  const matches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  return Array.from(matches, (m) => m[1]);
}

async function callGeminiSingleModel(
  model: string,
  apiKey: string,
  prompt: string,
  schemaDescription: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

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
    generationConfig: {
      temperature: 0.3,
      response_mime_type: 'application/json',
      maxOutputTokens: 8192,
      // Disable internal thinking tokens to preserve full output budget for translations
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
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
        throw new Error(
          'The translation was truncated because the article exceeded the maximum token limit. Please try translating in smaller sections or shortening the content.'
        );
      }
      if (candidate?.finishReason === 'SAFETY') {
        throw new Error('The translation request was stopped by Gemini safety filters.');
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
      lastError = err instanceof Error ? err : new Error(String(err));
      // If not transient or last attempt, fail out to next model
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
    throw new Error(
      'Gemini API Key is not configured. Please set GEMINI_API_KEY in your environment configuration.'
    );
  }

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  // Fallback model list if the primary model fails or is unavailable
  const candidateModels = [primaryModel, 'gemini-2.0-flash', 'gemini-1.5-flash'].filter(
    (val, idx, arr) => arr.indexOf(val) === idx
  );

  let lastError: Error | null = null;
  for (const model of candidateModels) {
    try {
      return await callGeminiSingleModel(model, apiKey, prompt, schemaDescription);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // If it's a token truncation or safety error, don't retry other models needlessly
      if (
        lastError.message.includes('token limit') ||
        lastError.message.includes('safety filters')
      ) {
        throw lastError;
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
    const parsed = JSON.parse(rawResult);

    // Verify image tags were preserved
    const guImages = extractImageSources(input.content_gu || '');
    const enImages = extractImageSources(parsed.content_en || '');
    if (guImages.length > 0 && enImages.length < guImages.length) {
      console.warn('Some images from Gujarati content may have been omitted during translation.');
    }

    return {
      success: true,
      data: {
        title_en: parsed.title_en || '',
        excerpt_en: parsed.excerpt_en || '',
        content_en: parsed.content_en || '',
      },
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
    const parsed = JSON.parse(rawResult);

    return {
      success: true,
      data: {
        title_en: parsed.title_en || '',
        subtitle_en: parsed.subtitle_en || '',
        content_en: (parsed.content_en || '').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n'),
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
