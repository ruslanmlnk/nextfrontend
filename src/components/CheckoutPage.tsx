'use client';

import React, { useState, useEffect, useRef } from 'react';
import { House, ChevronRight, Truck, User, Wallet, Loader2, Minus, Plus } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigation } from './NavigationContext';
import { api } from '../api';
import UiImage from './UiImage';

import { novaPoshtaApi } from '../api/np';
import type { NPCity, NPWarehouse } from '../types';

const CheckoutPage: React.FC = () => {
  const { items, totalAmount, updateQuantity } = useCart();
  const { navigateTo } = useNavigation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    warehouse: '',
    paymentMethod: 'card',
  });

  // NP state
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<NPCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NPCity | null>(null);

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [warehouses, setWarehouses] = useState<NPWarehouse[]>([]);

  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [isWhLoading, setIsWhLoading] = useState(false);

  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [warehousesError, setWarehousesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const citySearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // city is handled separately (API + dropdown)
    if (name === 'city') return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, city: value, warehouse: '' }));
    setCityQuery(value);
    setSelectedCity(null);
    setWarehouses([]);
    setWarehousesError(null);
    setShowCityDropdown(true);

    if (citySearchTimeout.current) clearTimeout(citySearchTimeout.current);

    citySearchTimeout.current = setTimeout(async () => {
      const q = value.trim();
      if (q.length < 2) {
        setCities([]);
        setCitiesError(null);
        return;
      }

      setIsCitiesLoading(true);
      setCitiesError(null);
      try {
        const found = await novaPoshtaApi.searchSettlements(q);
        setCities(found);
      } catch (error) {
        setCities([]);
        setCitiesError(error instanceof Error ? error.message : 'Не вдалося завантажити міста');
      }
      setIsCitiesLoading(false);
    }, 300);
  };

  const selectCity = async (city: NPCity) => {
    setSelectedCity(city);

    // show pretty text in input
    const display = city.Present || city.MainDescription || '';
    setFormData((prev) => ({ ...prev, city: display, warehouse: '' }));
    setCityQuery(display);

    setShowCityDropdown(false);

    setIsWhLoading(true);
    setWarehousesError(null);
    try {
      const wh = await novaPoshtaApi.getWarehouses(
        city.CityRef || city.Ref || String(city.SettlementId || ''),
        city.MainDescription || display
      );
      setWarehouses(wh);
      if (wh.length === 0) {
        setWarehousesError('Відділення не знайдено');
      }
    } catch (error) {
      setWarehouses([]);
      setWarehousesError(error instanceof Error ? error.message : 'Не вдалося завантажити відділення');
    }
    setIsWhLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
        },
        delivery: {
          city: formData.city, // можна зберігати text
          warehouse: formData.warehouse, // Description
          method: 'nova_poshta',
          // Якщо хочеш — можеш також відправляти cityRef:
          // cityRef: selectedCity?.Ref,
        },
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          colorTitle: item.colorTitle,
          colorSlug: item.colorSlug,
          colorHex: item.colorHex,
        })),
        total: totalAmount,
      };

      const response = await api.createOrder(orderData);
      if (!response?.success) {
        alert('Не вдалося створити замовлення. Спробуйте ще раз.');
        return;
      }

      if (formData.paymentMethod === 'card') {
        try {
          localStorage.setItem('lastCheckoutOrderId', String(response.id));
        } catch {
          // ignore
        }

        const checkoutRes = await fetch('/api/liqpay/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: response.id,
            amount: totalAmount,
          }),
        });

        const checkoutJson = await checkoutRes.json().catch(() => null);
        const endpoint = checkoutJson?.endpoint;
        const data = checkoutJson?.data;
        const signature = checkoutJson?.signature;

        if (
          !checkoutRes.ok ||
          typeof endpoint !== 'string' ||
          !endpoint ||
          typeof data !== 'string' ||
          !data ||
          typeof signature !== 'string' ||
          !signature
        ) {
          const message = checkoutJson?.error || 'Не вдалося ініціалізувати оплату LiqPay.';
          alert(message);
          return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = endpoint;
        form.acceptCharset = 'utf-8';

        const dataInput = document.createElement('input');
        dataInput.type = 'hidden';
        dataInput.name = 'data';
        dataInput.value = data;

        const signatureInput = document.createElement('input');
        signatureInput.type = 'hidden';
        signatureInput.name = 'signature';
        signatureInput.value = signature;

        form.appendChild(dataInput);
        form.appendChild(signatureInput);
        document.body.appendChild(form);
        form.submit();
        return;
      }

      alert('Замовлення успішно оформлено!');
      navigateTo('home');

      try {
        localStorage.removeItem('lastCheckoutOrderId');
      } catch {
        // ignore
      }
    } catch (error) {
      console.error('Checkout submit error:', error);
      alert(error instanceof Error ? error.message : 'Сталася помилка. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[1352px] mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Ваш кошик порожній</h2>
        <button onClick={() => navigateTo('catalog')} className="text-amber-500 underline">
          Перейти до каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}>
          <House
            size={16}
            className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors"
          />
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <button onClick={() => navigateTo('cart')} className="text-amber-500 font-medium hover:underline">
          Кошик
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">Оформлення замовлення</span>
      </nav>

      <h1 className="text-3xl font-extrabold uppercase text-gray-900 mb-8">Оформлення замовлення</h1>

      <form onSubmit={handleSubmit} className="w-full">
        {/* SECTION 1: ITEMS TABLE */}
        <div className="w-full mb-10">
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

                {/* Price */}
                <div className="col-span-1 md:col-span-2 p-6 flex items-center h-full">
                  <span className="md:hidden font-bold mr-2 text-xs uppercase text-gray-500">Ціна:</span>
                  <span className="font-bold text-[#282828] text-[16px] whitespace-nowrap">
                    {item.price.toLocaleString('uk-UA')} ₴
                  </span>
                </div>
              </div>
              );
            })}
          </div>

          {/* Total Bar */}
          <div className="bg-amber-400 text-white font-bold uppercase p-5 pr-8 flex justify-end items-center gap-12">
            <span className="text-[15px]">Усього</span>
            <span className="text-[22px]">{totalAmount.toLocaleString('uk-UA')} ₴</span>
          </div>
        </div>

        {/* SECTION 2: FORMS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* LEFT COLUMN: PERSONAL DATA */}
          <div className="bg-gray-100/50 rounded-sm">
            <div className="bg-[#EDEDED] p-4 flex items-center gap-3 rounded-t-sm">
              <div className="w-8 h-8 rounded-sm bg-amber-400 flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <h3 className="text-sm font-bold uppercase text-gray-900">Ваші особисті дані</h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#EDEDED] rounded-sm px-4 py-3">
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Ім'я*"
                />
              </div>

              <div className="bg-[#EDEDED] rounded-sm px-4 py-3">
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Прізвище*"
                />
              </div>

              <div className="bg-[#EDEDED] rounded-sm px-4 py-3">
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Телефон*"
                />
              </div>

              <div className="bg-[#EDEDED] rounded-sm px-4 py-3">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-gray-500 text-gray-900"
                  placeholder="Адреса електронної пошти*"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DELIVERY & PAYMENT */}
          <div className="flex flex-col gap-8">
            {/* Delivery */}
            <div className="bg-gray-100/50 rounded-sm">
              <div className="bg-[#EDEDED] p-4 flex items-center gap-3 rounded-t-sm">
                <div className="w-8 h-8 rounded-sm bg-amber-400 flex items-center justify-center text-white">
                  <Truck size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase text-gray-900">Доставка</h3>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-500 mb-2">Почніть вводити назву міста та оберіть його зі списку:</p>

                {/* City Input with API Search */}
                <div className="bg-[#EDEDED] rounded-sm px-2 py-1 relative" ref={dropdownRef}>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleCityChange}
                    onFocus={() => setShowCityDropdown(true)}
                    className="w-full bg-transparent border-none text-sm p-2 focus:outline-none placeholder-gray-500 text-gray-900"
                    placeholder="Вкажіть ваше місто"
                    autoComplete="off"
                  />

                  {/* Loading Spinner or Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isCitiesLoading ? (
                      <Loader2 size={16} className="text-amber-500 animate-spin" />
                    ) : (
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-amber-500"></div>
                    )}
                  </div>

                  {showCityDropdown && cities.length > 0 && (
                    <ul className="absolute z-20 left-0 top-full w-full bg-white border border-gray-200 max-h-60 overflow-y-auto shadow-lg mt-1 rounded-sm">
                      {cities.map((city) => (
                        <li
                          key={city.Ref}
                          onClick={() => selectCity(city)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-900 border-b border-gray-50 last:border-0"
                        >
                          {city.Present}
                        </li>
                      ))}
                    </ul>
                  )}

                  {showCityDropdown && citiesError && (
                    <div className="absolute z-20 left-0 top-full w-full bg-white border border-gray-200 p-2 shadow-lg mt-1 rounded-sm text-xs text-red-600">
                      {citiesError}
                    </div>
                  )}

                  {showCityDropdown && !isCitiesLoading && !citiesError && formData.city.trim().length >= 2 && cities.length === 0 && (
                    <div className="absolute z-20 left-0 top-full w-full bg-white border border-gray-200 p-2 shadow-lg mt-1 rounded-sm text-xs text-gray-500">
                      Місто не знайдено
                    </div>
                  )}
                </div>

                {/* Nova Poshta Radio */}
                <div className="flex items-center gap-3 my-4">
                  <input type="radio" checked={true} readOnly className="text-amber-400 focus:ring-amber-400 w-4 h-4" />
                  <div className="w-6 h-6 bg-red-600 text-white flex items-center justify-center font-bold text-xs rounded-sm">
                    НП
                  </div>
                  <span className="font-bold text-gray-900 text-sm">Нова пошта</span>
                </div>

                {/* Warehouse Select */}
                <div className="bg-[#EDEDED] rounded-sm px-2 py-1 relative">
                  <select
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none text-sm p-2 focus:outline-none text-gray-900 appearance-none disabled:text-gray-400"
                    disabled={!selectedCity || isWhLoading}
                    required
                  >
                    <option value="" className="text-gray-500">
                      {isWhLoading
                        ? 'Завантаження відділень...'
                        : !selectedCity
                          ? 'Спочатку оберіть місто'
                          : warehousesError || 'Оберіть відділення'}
                    </option>

                    {warehouses.map((wh) => (
                      <option key={wh.Ref} value={wh.Description}>
                        {wh.Description}
                      </option>
                    ))}
                  </select>

                  {/* Icons */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isWhLoading ? (
                      <Loader2 size={16} className="text-amber-500 animate-spin" />
                    ) : (
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-amber-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-gray-100/50 rounded-sm">
              <div className="bg-[#EDEDED] p-4 flex items-center gap-3 rounded-t-sm">
                <div className="w-8 h-8 rounded-sm bg-amber-400 flex items-center justify-center text-white">
                  <Wallet size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase text-gray-900">Метод оплати</h3>
              </div>

              <div className="p-6 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="text-amber-400 focus:ring-amber-400 w-4 h-4"
                  />
                  <span className="text-sm text-gray-900">Оплата під час доставки (накладений платіж)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="text-amber-400 focus:ring-amber-400 w-4 h-4"
                  />
                  <span className="text-sm text-gray-900">Онлайн–платежі Visa i MasterCard (LiqPay)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: BUTTONS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigateTo('cart')}
            className="bg-[#8C8C8C] hover:bg-[#777] text-white font-bold uppercase text-[13px] px-10 py-4 rounded-sm transition-colors w-full md:w-auto tracking-wider"
          >
            ПРОДОВЖИТИ ПОКУПКИ
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-[13px] px-10 py-4 rounded-sm shadow-md hover:shadow-lg transition-colors w-full md:w-auto tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Обробка…' : 'ОФОРМИТИ ЗАМОВЛЕННЯ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
