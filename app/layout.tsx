import type { Metadata } from 'next';
import { notoSerifGujarati, notoSansGujarati } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'શ્રીજી બાબાની કૃપા | શ્રીનાથજી ભક્તિ, પરંપરા અને પવિત્ર પ્રાર્થનાઓ',
  description:
    'શ્રીજી બાબાની અપર કૃપાથી પ્રેરિત પુષ્ટિમાર્ગીય વૈષ્ણવ ભક્તિ, આધ્યાત્મિક વિચારો, પવિત્ર પ્રાર્થનાઓ અને પરંપરાનો દિવ્ય સંગમ.',
  keywords: [
    'શ્રીજી બાબા',
    'શ્રીનાથજી',
    'પુષ્ટિમાર્ગ',
    'વૈષ્ણવ',
    'મધુરાષ્ટકમ',
    'યમુનાષ્ટકમ',
    'Shrinathji',
    'Pushtimarg',
    'Gujarati Devotional Blog',
  ],
  icons: {
    icon: '/images/defaults/logo-mandala.svg',
  },
  openGraph: {
    title: 'શ્રીજી બાબાની કૃપા',
    description: 'શ્રીજી બાબાની અપર કૃપાથી પ્રેરિત પુષ્ટિમાર્ગીય વૈષ્ણવ ભક્તિ અને પવિત્ર પ્રાર્થનાઓ.',
    url: 'https://shreejibabakrupa.com',
    siteName: 'શ્રીજી બાબાની કૃપા',
    images: [
      {
        url: '/images/defaults/hero-shrinathji.webp',
        width: 1200,
        height: 800,
        alt: 'શ્રીજી બાબા દર્શન',
      },
    ],
    locale: 'gu_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="gu"
      className={`${notoSerifGujarati.variable} ${notoSansGujarati.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased bg-[#FAF6F0] text-[#2C1A14]">
        {children}
      </body>
    </html>
  );
}
