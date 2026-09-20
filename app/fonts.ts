import { Noto_Serif_Gujarati, Noto_Sans_Gujarati } from 'next/font/google';

export const notoSerifGujarati = Noto_Serif_Gujarati({
  subsets: ['gujarati'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-gujarati',
  display: 'swap',
});

export const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-gujarati',
  display: 'swap',
});
