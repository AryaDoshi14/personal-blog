import * as z from 'zod';

export const prayerFormSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must be at most 200 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  title_gu: z
    .string()
    .min(1, 'Gujarati title is required')
    .max(500, 'Title too long'),
  title_en: z
    .string()
    .max(500, 'Title too long')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  subtitle_gu: z
    .string()
    .max(500, 'Subtitle too long')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  subtitle_en: z
    .string()
    .max(500, 'Subtitle too long')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  content_gu: z
    .string()
    .min(1, 'Gujarati content is required')
    .transform((v) => v.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n')),
  content_en: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n') : null)),
  icon_type: z.enum(['flute', 'lotus', 'peacock', 'namaste']),
  order_index: z
    .number()
    .int()
    .min(0)
    .default(0),
});

export type PrayerFormData = z.infer<typeof prayerFormSchema>;
