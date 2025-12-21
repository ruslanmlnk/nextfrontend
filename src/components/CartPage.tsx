'use client';

import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigation } from './NavigationContext';
import UiImage from './UiImage';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();
  const { navigateTo } = useNavigation();

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold uppercase text-gray-900 mb-8">КОШИК</h1>

      <div className="w-full">
        <div className="w-full border border-[#E5E5E5] border-b-0 bg-[#282828]">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 text-white">
            <div className="col-span-2 py-5 px-6 text-[13px] font-medium uppercase border-r border-[#3E3E3E] flex items-center">
              Зображення товару
            </div>
            <div className="col-span-3 py-5 px-6 text-[13px] font-medium uppercase border-r border-[#3E3E3E] flex items-center">
              Назва товару
            </div>
            <div className="col-span-3 py-5 px-6 text-[13px] font-medium uppercase border-r border-[#3E3E3E] flex items-center">
              Модель
            </div>
            <div className="col-span-2 py-5 px-6 text-[13px] font-medium uppercase border-r border-[#3E3E3E] flex items-center">
              Кількість
            </div>
            <div className="col-span-2 py-5 px-6 text-[13px] font-medium uppercase flex items-center">
              Ціна
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white border border-[#E5E5E5] border-t-0">
          {items.map((item) => {
            const itemKey = item.cartKey || `${item.id}-${item.colorSlug || item.colorTitle || 'default'}`;
            return (
              <div
                key={itemKey}
                className="grid grid-cols-1 md:grid-cols-12 border-b border-[#E5E5E5] last:border-0 md:h-[175px]"
              >
              {/* Image */}
              <div className="col-span-1 md:col-span-2 p-4 flex items-center justify-center md:border-r border-[#E5E5E5] h-full">
                <div className="w-[100px] h-[120px] flex items-center justify-center">
                  <UiImage
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                    width={200}
                    height={260}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="col-span-1 md:col-span-3 p-6 flex items-center md:border-r border-[#E5E5E5] h-full">
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Назва:</span>
                  <span className="font-bold text-[#282828] text-[15px]">{item.name}</span>
                  {item.colorTitle && (
                    <span className="text-xs text-gray-500 mt-1 md:ml-3">Колір: {item.colorTitle}</span>
                  )}
                </div>
              </div>

              {/* Model */}
              <div className="col-span-1 md:col-span-3 p-6 flex items-center md:border-r border-[#E5E5E5] h-full">
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Модель:</span>
                  <span className="font-medium text-[#282828] text-[15px]">{item.model}</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="col-span-1 md:col-span-2 p-6 flex items-center md:border-r border-[#E5E5E5] h-full">
                <div className="flex items-center w-full">
                  <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Кількість:</span>

                  <div className="bg-[#F0F0F0] rounded-[3px] p-[3px] flex items-center w-fit gap-[3px]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartKey || item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="w-[45px] h-[45px] flex items-center justify-center text-[#8C8C8C] hover:text-[#282828] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#8C8C8C]"
                      aria-label="Зменшити кількість"
                    >
                      <Minus size={16} />
                    </button>

                    <div className="w-[60px] h-[45px] bg-white flex items-center justify-center">
                      <span className="w-full text-center text-[15px] font-bold text-[#282828]">{item.quantity}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartKey || item.id, 1)}
                      disabled={typeof item.stock === 'number' && item.quantity >= item.stock}
                      className="w-[45px] h-[45px] flex items-center justify-center text-[#8C8C8C] hover:text-[#282828] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#8C8C8C]"
                      aria-label="Збільшити кількість"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="col-span-1 md:col-span-2 p-6 flex items-center h-full">
                <div className="flex items-center justify-between w-full gap-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Ціна:</span>
                    <span className="font-bold text-[#282828] text-[16px] whitespace-nowrap">
                      {item.price.toLocaleString('uk-UA')} ₴
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartKey || item.id)}
                    className="text-amber-400 hover:text-amber-500 transition-colors"
                    aria-label="Видалити товар"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
          {items.length === 0 && (
              <div className="p-8 text-center text-gray-500">Кошик порожній</div>
          )}
        </div>

        {/* Total Bar */}
        <div className="bg-amber-400 text-white font-bold uppercase p-5 pr-8 flex justify-end items-center gap-12">
          <span className="text-[15px]">Усього</span>
          <span className="text-[22px]">{totalAmount.toLocaleString('uk-UA')} ₴</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <button 
                onClick={() => navigateTo('catalog')}
                className="bg-[#8C8C8C] hover:bg-[#777] text-white font-bold uppercase text-xs px-8 py-4 rounded-sm transition-colors w-full md:w-auto"
            >
                ПРОДОВЖИТИ ПОКУПКИ
            </button>
            <button 
                onClick={() => navigateTo('checkout')}
                className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-8 py-4 rounded-sm shadow-md hover:shadow-lg transition-colors w-full md:w-auto"
            >
                ОФОРМИТИ ЗАМОВЛЕННЯ
            </button>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
