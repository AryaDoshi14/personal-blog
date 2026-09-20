import * as z from 'zod';

export const postFormSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(200, 'Slug must be at most 200 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens (e.g. shri-yamunaji-stuti)'),
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
  excerpt_gu: z
    .string()
    .min(1, 'Gujarati excerpt is required')
    .max(1000, 'Excerpt too long'),
  excerpt_en: z
    .string()
    .max(1000, 'Excerpt too long')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  content_gu: z
    .string()
    .min(1, 'Gujarati content is required'),
  content_en: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  cover_image_url: z
    .string()
    .refine((val) => !val || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'), {
      message: 'Invalid image URL or path',
    })
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  cover_image_alt: z
    .string()
    .max(500, 'Alt text too long')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  category_id: z
    .string()
    .uuid('Invalid category')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  tags: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? v.split(',').map((t) => t.trim()).filter(Boolean) : [])),
  status: z.enum(['draft', 'published']),
});

// Cover image alt text is required when a cover image is set
export const postFormSchemaWithAltCheck = postFormSchema.refine(
  (data) => {
    if (data.cover_image_url && (!data.cover_image_alt || data.cover_image_alt.trim().length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Alt text is required when a cover image is set',
    path: ['cover_image_alt'],
  }
);

export type PostFormData = z.infer<typeof postFormSchema>;
