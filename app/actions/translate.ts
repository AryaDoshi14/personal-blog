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
2. HTML Preservation: The content may contain HTML markup from a rich-text editor (such as <h2>, <h3>, <p>, <blockquote>, <ul>, <ol>, <li>, <strong>, <em>, <a href="...">, <img src="..." alt="..." />). You MUST PRESERVE all HTML tags, structure, and attributes EXACTLY. Only translate the human-readable text inside the elements. Do NOT drop, modify, or corrupt any HTML tags.
3. Devotional Tone: Maintain a respectful, humble, and reverent tone suitable for devotees and readers seeking spiritual contemplation.
4. Output Format: Return strictly valid JSON with no markdown backticks, no code blocks, and no preamble or conversational filler.
`.trim();

async function callGemini(prompt: string, schemaDescription: string): Promise<string> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured in .env.local. Please add your Google Gemini API key to enable auto-translation.'
    );
  }

  // Use gemini-2.5-flash with fallback to gemini-1.5-flash
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  // NOTE: API key is sent in the header, NOT in the URL, to avoid it appearing
  // in server logs, browser history, or Referer headers.
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
            text: `${prompt}\n\nRespond with valid JSON matching this schema:\n${schemaDescription}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      response_mime_type: 'application/json',
      // Prevent truncation on long posts; Gemini 2.5 Flash supports up to 8192
      maxOutputTokens: 8192,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Send key in header, not in URL query string
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
    throw new Error(`Gemini translation error (${response.status}): ${parsedMessage}`);
  }

  const json = await response.json();
  const textOutput =
    json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

  if (!textOutput) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  return textOutput;
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

Gujarati Title:
${input.title_gu || ''}

Gujarati Excerpt:
${input.excerpt_gu || ''}

Gujarati Content (HTML):
${input.content_gu || ''}
    `.trim();

    const schemaDescription = `{
  "title_en": "English title string",
  "excerpt_en": "English excerpt string (concise summary)",
  "content_en": "English HTML content with identical markup structure"
}`;

    const rawResult = await callGemini(prompt, schemaDescription);
    const parsed = JSON.parse(rawResult);

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
Please translate the following Gujarati devotional prayer/hymn fields to English:

Gujarati Prayer Title:
${input.title_gu || ''}

Gujarati Subtitle:
${input.subtitle_gu || ''}

Gujarati Content:
${input.content_gu || ''}
    `.trim();

    const schemaDescription = `{
  "title_en": "English title string",
  "subtitle_en": "English subtitle / brief one-line description",
  "content_en": "English prayer/hymn text with sacred transliteration preserved"
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
