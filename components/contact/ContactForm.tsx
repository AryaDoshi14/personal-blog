'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { handleContactFormSubmit } from '@/app/actions/contact';
import { Language } from '@/types';

interface ContactFormProps {
  lang: Language;
}

export const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const isGu = lang === 'gu';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError(
        isGu
          ? 'કૃપા કરીને નામ, ઈમેલ અને સંદેશ દાખલ કરો.'
          : 'Please enter name, email, and message.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await handleContactFormSubmit(formData);
      if (result.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setError(result.error || (isGu ? 'સંદેશ મોકલવામાં નિષ્ફળતા.' : 'Failed to send message.'));
      }
    } catch {
      setError(isGu ? 'અજાણ્યો ક્ષતિ આવી. ફરી પ્રયાસ કરો.' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#FFFDF9] border border-[#C59B4B]/60 rounded-2xl p-8 text-center shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-[#C59B4B] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#501518] font-serif-gu mb-2">
          {isGu ? 'આપનો સંદેશ સફળતાપૂર્વક મળ્યો છે!' : 'Your message has been sent successfully!'}
        </h3>
        <p className="text-sm text-[#614D43] font-serif-gu mb-6">
          {isGu
            ? 'અમે ટૂંક સમયમાં આપનો સંપર્ક કરીશું. શ્રીજી બાવાની કૃપા આપ પર બની રહે.'
            : 'We will get back to you shortly. May Shreeji Baba shower His blessings on you.'}
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="px-6 py-2 rounded-lg bg-[#501518] text-white font-serif-gu text-sm hover:bg-[#6B1D23] transition-colors"
        >
          {isGu ? 'બીજો સંદેશ મોકલો' : 'Send Another Message'}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFFDF9] border border-[#E8DFD3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
    >
      {error && (
        <div className="p-4 rounded-xl bg-[#FDF3F3] border border-[#88252C]/30 text-xs sm:text-sm text-[#88252C] flex items-center gap-2 font-serif-gu">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#501518] font-serif-gu mb-1">
          {isGu ? 'આપનું નામ *' : 'Your Name *'}
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={isGu ? 'નામ દાખલ કરો...' : 'Enter your name...'}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-sm text-[#2C1A14] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] font-serif-gu"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#501518] font-serif-gu mb-1">
            {isGu ? 'ઈમેલ સરનામું *' : 'Email Address *'}
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@gmail.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-sm text-[#2C1A14] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] font-serif-gu"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#501518] font-serif-gu mb-1">
            {isGu ? 'મોબાઇલ નંબર (વૈકલ્પિક)' : 'Phone Number (Optional)'}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-sm text-[#2C1A14] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] font-serif-gu"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#501518] font-serif-gu mb-1">
          {isGu ? 'વિષય' : 'Subject'}
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder={isGu ? 'વિષય લખો...' : 'Enter subject...'}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-sm text-[#2C1A14] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] font-serif-gu"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#501518] font-serif-gu mb-1">
          {isGu ? 'આપનો સંદેશ *' : 'Your Message *'}
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={isGu ? 'અહીં આપનો સંદેશ લખો...' : 'Write your message here...'}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD3] bg-[#FAF6F0] text-sm text-[#2C1A14] focus:outline-none focus:ring-2 focus:ring-[#C59B4B] font-serif-gu resize-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#501518] text-white font-serif-gu font-medium text-base hover:bg-[#6B1D23] transition-colors shadow-md disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>
            {isSubmitting
              ? isGu
                ? 'મોકલી રહ્યાં છે...'
                : 'Sending...'
              : isGu
              ? 'સંદેશ મોકલો'
              : 'Send Message'}
          </span>
        </button>
      </div>
    </form>
  );
};
