'use client';

import React, { useState } from 'react';
import { House, ChevronRight, Package, Clock, CreditCard, Banknote, ShieldCheck, Award, Handshake, ChevronDown } from 'lucide-react';
import { useNavigation } from './NavigationContext';

const PAYMENT_OPTIONS = [
  { 
    id: 'card', 
    label: 'Оплата на банківську карту', 
    icon: CreditCard, 
    content: 'Ви можете оплатити замовлення онлайн банківською картою Visa або MasterCard без комісії відразу після оформлення замовлення на сайті.' 
  },
  { 
    id: 'cod', 
    label: 'Оплата при отриманні та на розрахунковий рахунок ФОП', 
    icon: Banknote, 
    content: 'Оплата готівкою або карткою при отриманні товару у відділенні Нової Пошти або кур\'єру. Також можлива оплата на розрахунковий рахунок для фізичних та юридичних осіб.' 
  },
  { 
    id: 'compatibility', 
    label: 'Підходить для всіх популярних марок', 
    icon: ShieldCheck, 
    content: 'Наші товари універсальні та сумісні з більшістю популярних брендів та моделей. Перед покупкою ви можете проконсультуватися з менеджером.' 
  },
  { 
    id: 'warranty', 
    label: 'Заводська гарантія', 
    icon: Award, 
    content: 'На всі товари надається офіційна гарантія від виробника терміном від 12 до 36 місяців. Гарантійний талон додається до кожного замовлення.' 
  },
  { 
    id: 'support', 
    label: 'Підтримка', 
    icon: Handshake, 
    content: 'Наша служба підтримки працює для вас 7 днів на тиждень з 09:00 до 19:00. Ми готові відповісти на будь-які запитання щодо товару, оплати або доставки.' 
  },
];

const DeliveryPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [openSection, setOpenSection] = useState<string | null>('delivery');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}>
            <House size={16} className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors" />
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">Умови оплати та доставки</span>
      </nav>

      {/* Main Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-gray-600 mb-10">Умови оплати та доставки</h1>

      {/* DELIVERY SECTION */}
      <div className="mb-10">
        <div className="rounded-sm overflow-visible">
           {/* Header */}
           <button 
             onClick={() => toggleSection('delivery')}
             className={`w-full relative px-5 flex items-center justify-between transition-colors h-[54px] ${openSection === 'delivery' ? 'bg-amber-500 text-white' : 'bg-[#F3F3F3] text-gray-600 hover:bg-gray-200'}`}
           >
              <div className="flex items-center gap-4">
                 <Package size={20} className={openSection === 'delivery' ? "text-white" : "text-gray-500"} />
                 <span className={`font-bold text-sm uppercase ${openSection === 'delivery' ? "text-white" : "text-gray-800"}`}>
                    Доставка по всій Україні
                 </span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${openSection === 'delivery' ? 'rotate-180' : ''}`} />
              
              {/* Triangle Pointer */}
              {openSection === 'delivery' && (
                <div className="absolute top-full left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-amber-500 z-10"></div>
              )}
           </button>
           
           {/* Content */}
           <div className={`transition-all duration-300 overflow-hidden ${openSection === 'delivery' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="p-6 border border-gray-100 border-t-0 bg-[#F1F1F1]">
                <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-5xl">
                    Ми здійснюємо доставку товарів у будь-який куточок України - чи то велике місто, чи то невелике село. Працюємо з надійними службами доставки: Нова Пошта, УкрПошта, Justin. Під час оформлення замовлення ви можете вибрати відповідне відділення або кур'єрську доставку додому. Середній термін доставки - від 1 до 3 робочих днів.
                </p>
                <div className="bg-[#F3F3F3] p-4 flex items-center gap-4 rounded-sm border border-gray-100 w-fit">
                    <Clock size={24} className="text-gray-500" />
                    <span className="text-gray-800 font-bold text-sm">Швидке опрацювання замовлень</span>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* PAYMENT SECTION */}
      <div className="mb-20">
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-gray-600 mb-8">Оплата та інші варіанти</h2>

        <div className="space-y-3">
            {PAYMENT_OPTIONS.map((opt) => (
                <div key={opt.id} className="rounded-sm overflow-visible">
                    <button 
                        onClick={() => toggleSection(opt.id)}
                        className={`w-full relative px-5 flex items-center justify-between transition-colors h-[54px] ${openSection === opt.id ? 'bg-amber-500 text-white' : 'bg-[#F3F3F3] text-gray-600 hover:bg-gray-200'}`}
                    >
                        <div className="flex items-center gap-4">
                            <opt.icon size={20} className={openSection === opt.id ? "text-white" : "text-gray-500"} />
                            <span className={`font-bold text-sm uppercase ${openSection === opt.id ? "text-white" : "text-gray-800"}`}>
                                {opt.label}
                            </span>
                        </div>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${openSection === opt.id ? 'rotate-180' : ''}`} />
                        
                        {/* Triangle Pointer */}
                        {openSection === opt.id && (
                            <div className="absolute top-full left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-amber-500 z-10"></div>
                        )}
                    </button>
                    
                    <div className={`transition-all duration-300 overflow-hidden ${openSection === opt.id ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 border border-gray-100 border-t-0 bg-[#F1F1F1] text-sm text-gray-600 leading-relaxed">
                            {opt.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default DeliveryPage;

