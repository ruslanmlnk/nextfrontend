'use client';

import React, { useState } from 'react';
import {
  House,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Instagram,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import { useNavigation } from './NavigationContext';

const ContactPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = formData.phone.trim();
    if (!phone) {
      setStatus('error');
      setToast({ message: 'Телефон є обов’язковим.', type: 'error' });
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim() || undefined,
          email: formData.email.trim() || undefined,
          phone,
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim() || undefined,
          source: 'contact-page',
        }),
      });

      if (!res.ok) throw new Error('Submit failed');
      setStatus('success');
      setToast({ message: 'Повідомлення надіслано! Ми зв’яжемося з вами.', type: 'success' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      setStatus('error');
      setToast({ message: 'Не вдалося надіслати. Перевірте номер і спробуйте ще раз.', type: 'error' });
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-amber-400 mb-10">
          <button onClick={() => navigateTo('home')}>
            <House
              size={16}
              className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors"
            />
          </button>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-amber-500 font-medium uppercase tracking-wider">Контакти</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#282828] mb-12 flex items-center gap-4">
          Контакти
          <span className="h-[2px] flex-1 bg-gray-100 hidden md:block"></span>
        </h1>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Phone Card */}
          <div className="bg-[#F8F8F8] p-8 rounded-sm border border-gray-100 flex flex-col items-center text-center group hover:border-amber-400 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-sm group-hover:bg-amber-400 group-hover:text-white transition-colors">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-[#282828] uppercase text-sm mb-4">Телефони</h3>
            <div className="flex flex-col gap-1">
              <a
                href="tel:+380505956273"
                className="text-[15px] text-[#777] hover:text-amber-500 transition-colors font-medium"
              >
                +38 (050) 595-62-73
              </a>
              <a
                href="tel:+380505573395"
                className="text-[15px] text-[#777] hover:text-amber-500 transition-colors font-medium"
              >
                +38 (050) 557-33-95
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-[#F8F8F8] p-8 rounded-sm border border-gray-100 flex flex-col items-center text-center group hover:border-amber-400 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-sm group-hover:bg-amber-400 group-hover:text-white transition-colors">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-[#282828] uppercase text-sm mb-4">Електронна пошта</h3>
            <a
              href="mailto:ostrowtor@gmail.com"
              className="text-[15px] text-[#777] hover:text-amber-500 transition-colors font-medium"
            >
              ostrowtor@gmail.com
            </a>
          </div>

          {/* Address Card */}
          <div className="bg-[#F8F8F8] p-8 rounded-sm border border-gray-100 flex flex-col items-center text-center group hover:border-amber-400 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-sm group-hover:bg-amber-400 group-hover:text-white transition-colors">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-[#282828] uppercase text-sm mb-4">Адреса</h3>
            <p className="text-[15px] text-[#777] font-medium leading-relaxed">
              м. Київ, с. Вишневе <br /> вул. Чорновола, 1
            </p>
          </div>

          {/* Schedule Card */}
          <div className="bg-[#F8F8F8] p-8 rounded-sm border border-gray-100 flex flex-col items-center text-center group hover:border-amber-400 transition-all duration-300">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-sm group-hover:bg-amber-400 group-hover:text-white transition-colors">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-[#282828] uppercase text-sm mb-4">Графік роботи</h3>
            <div className="text-[15px] text-[#777] font-medium leading-relaxed">
              <p>Пн-Пт: 09:00 - 19:00</p>
              <p>Сб: 09:00 - 18:00</p>
              <p>Нд: Вихідний</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch mb-16">
          {/* Feedback Form */}
          <div className="w-full lg:w-1/2 bg-white border border-gray-100 p-8 md:p-10 rounded-sm shadow-sm">
            <div className="mb-8">
              <h2 className="text-xl font-extrabold uppercase text-[#282828] mb-2">Напишіть нам</h2>
              <p className="text-sm text-[#777]">
                Є запитання? Заповніть форму, і ми відповімо вам найближчим часом.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Ваше ім&apos;я</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Олександр"
                  className="bg-[#F5F5F5] border-none rounded-sm px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Ваш Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="example@mail.com"
                  className="bg-[#F5F5F5] border-none rounded-sm px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Телефон</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+380"
                  maxLength={16}
                  inputMode="tel"
                  className="bg-[#F5F5F5] border-none rounded-sm px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Тема</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Запитання щодо товару"
                  className="bg-[#F5F5F5] border-none rounded-sm px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">Повідомлення</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Напишіть ваше повідомлення тут..."
                  rows={5}
                  className="bg-[#F5F5F5] border-none rounded-sm px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none transition-all"
                ></textarea>
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-[13px] px-10 py-4 rounded-sm shadow-md hover:shadow-lg transition-all w-full md:w-auto tracking-widest"
                >
                  Відправити повідомлення
                </button>
              </div>
            </form>
          </div>

          {/* Map & Socials Column */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div className="flex-1 w-full bg-gray-100 rounded-sm overflow-hidden min-h-[350px] shadow-sm relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.258993206689!2d30.384!3d50.393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDIzJzM0LjgiTiAzMMKwMjMnMDIuNCJF!5e0!3m2!1suk!2sua!4v1620000000000!5m2!1suk!2sua"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>

            <div className="bg-[#282828] text-white p-8 rounded-sm">
              <h3 className="font-bold uppercase text-sm mb-6 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-amber-400"></span>
                Ми в соцмережах
              </h3>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="flex items-center gap-3 bg-[#333] hover:bg-amber-400 px-5 py-3 rounded-sm transition-all group">
                  <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">Facebook</span>
                </a>
                <a href="#" className="flex items-center gap-3 bg-[#333] hover:bg-amber-400 px-5 py-3 rounded-sm transition-all group">
                  <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">Instagram</span>
                </a>
                <a href="#" className="flex items-center gap-3 bg-[#333] hover:bg-amber-400 px-5 py-3 rounded-sm transition-all group">
                  <Send size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">Telegram</span>
                </a>
                <a href="#" className="flex items-center gap-3 bg-[#333] hover:bg-amber-400 px-5 py-3 rounded-sm transition-all group">
                  <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-wider">Viber</span>
                </a>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default ContactPage;
