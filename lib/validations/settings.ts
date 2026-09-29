import * as z from 'zod';

export const siteSettingsSchema = z.object({
  site_name_gu: z.string().min(1, 'Required'),
  site_name_en: z.string().min(1, 'Required'),
  site_tagline_gu: z.string().min(1, 'Required'),
  site_tagline_en: z.string().optional().or(z.literal('')),
  header_logo_url: z.string().optional().or(z.literal('')),
  hero_heading_gu: z.string().min(1, 'Required'),
  hero_heading_en: z.string().optional().or(z.literal('')),
  hero_intro_gu: z.string().min(1, 'Required'),
  hero_intro_en: z.string().optional().or(z.literal('')),
  hero_sanskrit_line_gu: z.string().optional().or(z.literal('')),
  hero_sanskrit_line_en: z.string().optional().or(z.literal('')),
  hero_image_url: z.string().optional().or(z.literal('')),
  tradition_title_gu: z.string().min(1, 'Required'),
  tradition_title_en: z.string().optional().or(z.literal('')),
  tradition_text_gu: z.string().min(1, 'Required'),
  tradition_text_en: z.string().optional().or(z.literal('')),
  tradition_image_url: z.string().optional().or(z.literal('')),
  author_photo_url: z.string().optional().or(z.literal('')),
  author_name_gu: z.string().min(1, 'Author name (Gujarati) is required'),
  author_name_en: z.string().optional().or(z.literal('')),
  author_bio_gu: z.string().optional().or(z.literal('')),
  author_bio_en: z.string().optional().or(z.literal('')),
  contact_email: z.string().email('Invalid email').or(z.literal('')),
  contact_phone: z.string().optional().or(z.literal('')),
  social_facebook: z.string().url('Invalid URL').or(z.literal('')),
  social_instagram: z.string().url('Invalid URL').or(z.literal('')),
  social_youtube: z.string().url('Invalid URL').or(z.literal('')),
  footer_copyright_gu: z.string().optional().or(z.literal('')),
  footer_copyright_en: z.string().optional().or(z.literal('')),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z
    .string()
    .email('Invalid email address'),
  phone: z
    .string()
    .max(20, 'Phone number too long')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .max(200, 'Subject too long')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
  // Honeypot field — must be empty
  website: z
    .string()
    .max(0, 'Invalid submission')
    .optional()
    .or(z.literal('')),
});
