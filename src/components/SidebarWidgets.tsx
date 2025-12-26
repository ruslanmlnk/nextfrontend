
import React from 'react';
import { Star } from 'lucide-react';
import UiImage from './UiImage';
import { fetchProducts } from '@/graphql/fetchers/products';
import { getImageUrl } from '@/api';
import Link from 'next/link';
import { Product } from '@/types';

const SidebarWidgets: React.FC<Product[]> = ( products )  => {


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
          {products.slice(0, 4).map((item) => (
            <Link
              href={ item.slug ? `/product/${item.slug}` : `/product/${item.id}`}
              key={item.id}
              className="flex gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0"
            >
              <div className="w-16 h-16 flex-shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                <UiImage
                  src={getImageUrl(item.image) || ''}
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
            </Link>
          ))}
        </div>
      </div>

      {/* Consultation Widget */}
      <div className="w-full bg-[#F5F5F5] rounded-lg overflow-hidden border border-gray-100">
        <div className="w-full h-[240px] relative">
          <UiImage
            src="/img/consultation.png"
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
