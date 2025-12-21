'use client';

import React, { useState } from 'react';
import UiImage from './UiImage';

const PromoSection: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: trimmedPhone,
          source: 'promo-consultation',
        }),
      });

      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setPhone('');
      setToast({ message: 'Запит на консультацію надіслано!', type: 'success' });
    } catch {
      setStatus('error');
      setToast({ message: 'Не вдалося надіслати. Перевірте номер і спробуйте ще раз.', type: 'error' });
    }
  };

  return (
    <section className="bg-gray-100 py-16 my-10">
      <div className="w-full max-w-[1352px] mx-auto px-4 flex flex-col md:flex-row items-stretch">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 pr-0 md:pr-12 flex flex-col justify-center mb-8 md:mb-0">
            <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">Безкоштовна консультація</span>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-gray-900 mb-6 leading-tight">
                Потрібна консультація<br/> фахівця?
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Заповніть форму і ми вам зателефонуємо
            </p>
            
            <form className="flex flex-col sm:flex-row gap-2 max-w-md" onSubmit={handleSubmit}>
                <input 
                    type="tel" 
                    placeholder="Введіть ваш телефон" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={16}
                    inputMode="tel"
                    className="flex-1 bg-white border border-gray-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-amber-400 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold uppercase text-xs px-6 py-3 rounded-sm transition-colors"
                >
                    Відправити
                </button>
                {status === 'success' && (
                  <span className="text-xs text-green-600 font-semibold ml-1">Дякуємо, ми зв'яжемося!</span>
                )}
                {status === 'error' && (
                  <span className="text-xs text-red-500 font-semibold ml-1">Перевірте телефон і спробуйте ще раз.</span>
                )}
            </form>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative min-h-[300px]">
            <UiImage
              src="/img/consultation.png"
              alt="Warehouse worker"
              className="w-full h-full object-cover rounded-[20px] shadow-md"
              width={1000}
              height={700}
              sizes="100vw"
            />
        </div>

      </div>
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-sm text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
          <button
            type="button"
            className="ml-3 text-white/80 hover:text-white"
            onClick={() => setToast(null)}
            aria-label="Закрити сповіщення"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
};

export default PromoSection;
