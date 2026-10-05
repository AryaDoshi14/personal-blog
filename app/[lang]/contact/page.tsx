import React from 'react';
import { notFound } from 'next/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSiteSettings } from '@/lib/db';
import { Language } from '@/types';

interface ContactPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export const revalidate = 300;

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;

  if (lang !== 'gu' && lang !== 'en') {
    notFound();
  }

  const validLang = lang as Language;
  const isGu = validLang === 'gu';
  const settings = await getSiteSettings();

  return (
    <div className="py-12 sm:py-16 bg-[#FAF6F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={isGu ? 'અમારો સંપર્ક કરો' : 'Contact Us'}
          subtitle={
            isGu
              ? 'આપના પ્રશ્નો, સુઝાવો અથવા ભક્તિ સંબંધી વિચારો અમારી સાથે શેર કરો'
              : 'Share your questions, devotional feedback, or messages with us'
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFDF9] border border-[#E8DFD3] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#501518] font-serif-gu mb-6 pb-2 border-b border-[#E8DFD3]">
                {isGu ? 'સંપર્ક વિગતો' : 'Contact Details'}
              </h3>

              <div className="space-y-5 text-[#2C1A14] font-serif-gu">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#C59B4B]/50 flex items-center justify-center text-[#501518] flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#C59B4B]" />
                  </div>
                  <div>
                    <h4 className="text-xs text-[#614D43] uppercase tracking-wider font-semibold">
                      {isGu ? 'ઈમેલ' : 'Email'}
                    </h4>
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="text-base text-[#501518] hover:text-[#C59B4B] font-medium transition-colors"
                    >
                      {settings.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#C59B4B]/50 flex items-center justify-center text-[#501518] flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#C59B4B]" />
                  </div>
                  <div>
                    <h4 className="text-xs text-[#614D43] uppercase tracking-wider font-semibold">
                      {isGu ? 'ફોન' : 'Phone'}
                    </h4>
                    <a
                      href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
                      className="text-base text-[#501518] hover:text-[#C59B4B] font-medium transition-colors"
                    >
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-[#C59B4B]/50 flex items-center justify-center text-[#501518] flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#C59B4B]" />
                  </div>
                  <div>
                    <h4 className="text-xs text-[#614D43] uppercase tracking-wider font-semibold">
                      {isGu ? 'સ્થળ' : 'Location'}
                    </h4>
                    <p className="text-base text-[#501518] font-medium">
                      {isGu ? 'ગુજરાત, ભારત' : 'Gujarat, India'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Devotional Note */}
              <div className="mt-8 pt-6 border-t border-[#E8DFD3] text-center">
                <p className="text-sm italic font-serif-gu text-[#8C6D2D]">
                  || શ્રી કૃષ્ણ શરણં મમ: ||
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <ContactForm lang={validLang} />
          </div>
        </div>
      </div>
    </div>
  );
}
