'use client';

import React from 'react';
import { Star } from 'lucide-react';
import UiImage from './UiImage';

const POPULAR_ITEMS = [
  {
    id: 1,
    name: 'Холодильник Samsung RB34T600',
    price: 85.0,
    oldPrice: 98.0,
    image:
      'https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png',
    rating: 5,
  },
  {
    id: 2,
    name: 'Стильний обідній стіл',
    price: 132.0,
    image:
      'https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png',
    rating: 5,
  },
  {
    id: 3,
    name: 'Холодильник Samsung RB34T600',
    price: 98.0,
    image:
      'https://i.ibb.co/NdysLRCm/5f72290eb2e9285223eba7828a9153b2c9dcb3ed.png',
    rating: 5,
  },
  {
    id: 4,
    name: 'Стильний обідній стіл',
    price: 76.0,
    image:
      'https://i.ibb.co/PzTgLXN5/b0a73fcaf0bca244f75fc86dacff35ce5ea766ec.png',
    rating: 5,
  },
];

const SidebarWidgets: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Popular Products Widget */}
      <div className="w-full border border-gray-100 rounded-sm bg-white">
        <div className="bg-amber-400 p-4">
          <h3 className="text-white font-bold uppercase text-[13px] tracking-widest">
            ПОПУЛЯРНІ ТОВАРИ
          </h3>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {POPULAR_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0"
            >
              <div className="w-16 h-16 flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                <UiImage
                  src={item.image}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[11px] font-bold text-gray-800 uppercase leading-tight mb-1">
                  {item.name}
                </h4>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < item.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200 fill-gray-200'
                      }
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold text-sm">
                    {item.price.toLocaleString('uk-UA')} ₴
                  </span>
                  {item.oldPrice && (
                    <span className="text-gray-300 text-xs line-through">
                      {item.oldPrice.toLocaleString('uk-UA')} ₴
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Widget */}
      <div className="w-full bg-[#F5F5F5] rounded-lg overflow-hidden border border-gray-100">
        <div className="w-full h-[240px] relative">
          <UiImage
            src="https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=800&auto=format&fit=crop"
            alt="Consultation"
            className="w-full h-full object-cover object-top"
            width={800}
            height={240}
            sizes="100vw"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-[15px] font-extrabold uppercase text-[#282828] mb-3 leading-tight">
            ПОТРІБНА КОНСУЛЬТАЦІЯ <br /> ФАХІВЦЯ?
          </h3>
          <p className="text-[13px] text-[#777] mb-6 leading-relaxed">
            Заповніть форму і ми вам <br /> зателефонуємо
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="tel"
              placeholder="Введіть ваш телефон"
              className="w-full bg-white border border-[#D0D0D0] rounded-[4px] px-4 py-3 text-[13px] focus:outline-none focus:border-amber-400 placeholder-[#8C8C8C] text-[#282828]"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-[13px] px-4 py-3.5 rounded-[4px] transition-colors w-full shadow-sm tracking-wider"
            >
              НАДІСЛАТИ ЗАЯВКУ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SidebarWidgets;
