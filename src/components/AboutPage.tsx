'use client';

import React from 'react';
import { House, ChevronRight, Award, Users, Smile, Clock, Target, Leaf, Truck } from 'lucide-react';
import { useNavigation } from './NavigationContext';
import UiImage from './UiImage';

const AboutPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="w-full max-w-[1352px] mx-auto px-4 py-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-amber-400 mb-8">
        <button onClick={() => navigateTo('home')}>
            <House size={16} className="fill-gray-400 text-gray-400 hover:text-amber-500 hover:fill-amber-500 transition-colors" />
        </button>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-amber-500 font-medium">Про компанію</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-gray-900 mb-12">Про компанію</h1>

      {/* Main Info Section */}
      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-bold uppercase text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-amber-400"></span>
                Хто ми є
            </h2>
            <div className="text-gray-600 text-sm leading-7 space-y-4">
                <p>
                    <span className="font-bold text-gray-900">Острів</span> — це більше, ніж просто інтернет-магазин меблів та побутової техніки. Це простір, де створюється затишок вашої оселі. Ми працюємо на ринку України вже понад 10 років, пропонуючи нашим клієнтам лише перевірені бренди, якісні матеріали та сучасний дизайн.
                </p>
                <p>
                    Наша місія — зробити процес облаштування дому максимально простим та приємним. Ми віримо, що кожна деталь інтер'єру має значення, тому ретельно відбираємо товари для нашого каталогу. Від зручного дивану до надійного холодильника — у нас є все, щоб ваше життя стало комфортнішим.
                </p>
                <p>
                    Ми пишаємося нашою командою професіоналів, які завжди готові допомогти з вибором, проконсультувати щодо характеристик та організувати швидку доставку у будь-який куточок країни.
                </p>
            </div>
            
            <div className="mt-8">
                <button 
                    onClick={() => navigateTo('catalog')}
                    className="bg-amber-400 hover:bg-amber-500 text-white font-bold uppercase text-xs px-8 py-4 rounded-sm shadow-md hover:shadow-lg transition-colors"
                >
                    Перейти до каталогу
                </button>
            </div>
        </div>
        
        <div className="w-full lg:w-1/2">
            <div className="relative h-[400px] w-full rounded-sm overflow-hidden shadow-lg group">
                <UiImage
                  src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Офіс Острів"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width={1000}
                  height={700}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#F8F8F8] border border-gray-100 rounded-sm p-10 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-500 mb-4 shadow-sm border border-gray-100">
                    <Clock size={32} />
                </div>
                <span className="text-3xl font-extrabold text-gray-900 mb-1">10+</span>
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Років на ринку</span>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-500 mb-4 shadow-sm border border-gray-100">
                    <Smile size={32} />
                </div>
                <span className="text-3xl font-extrabold text-gray-900 mb-1">15 000+</span>
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Задоволених клієнтів</span>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-500 mb-4 shadow-sm border border-gray-100">
                    <Award size={32} />
                </div>
                <span className="text-3xl font-extrabold text-gray-900 mb-1">5 000+</span>
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Товарів у каталозі</span>
            </div>
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-500 mb-4 shadow-sm border border-gray-100">
                    <Users size={32} />
                </div>
                <span className="text-3xl font-extrabold text-gray-900 mb-1">45</span>
                <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Спеціалістів у команді</span>
            </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold uppercase text-center text-gray-900 mb-12 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Наші цінності
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-100 p-8 rounded-sm hover:shadow-lg transition-shadow bg-white">
                <Leaf size={40} className="text-amber-400 mb-6" />
                <h3 className="text-lg font-bold uppercase text-gray-900 mb-3">Якість та Екологічність</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Ми співпрацюємо лише з виробниками, які використовують безпечні та сертифіковані матеріали. Ваше здоров'я та комфорт — наш пріоритет.
                </p>
            </div>
            <div className="border border-gray-100 p-8 rounded-sm hover:shadow-lg transition-shadow bg-white">
                <Target size={40} className="text-amber-400 mb-6" />
                <h3 className="text-lg font-bold uppercase text-gray-900 mb-3">Клієнтоорієнтованість</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Ми не просто продаємо товар, ми вирішуємо ваші завдання. Індивідуальний підхід до кожного замовлення та підтримка на всіх етапах.
                </p>
            </div>
            <div className="border border-gray-100 p-8 rounded-sm hover:shadow-lg transition-shadow bg-white">
                <Truck size={40} className="text-amber-400 mb-6" />
                <h3 className="text-lg font-bold uppercase text-gray-900 mb-3">Надійність та Швидкість</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Власна система логістики та партнерство з провідними перевізниками дозволяють нам доставляти ваші замовлення вчасно та неушкодженими.
                </p>
            </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="bg-[#2a2a2a] text-white p-12 md:p-16 rounded-sm text-center">
         <h3 className="text-xl md:text-2xl font-light italic mb-6 max-w-4xl mx-auto leading-relaxed opacity-90">
            "Дім — це не місце, а відчуття. Ми працюємо для того, щоб ви завжди хотіли повертатися додому."
         </h3>
         <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-amber-400 mb-4"></div>
            <span className="font-bold uppercase tracking-widest text-sm">Олексій Вергай</span>
            <span className="text-xs text-gray-400 mt-1 uppercase">Засновник компанії Острів</span>
         </div>
      </div>

    </div>
  );
};

export default AboutPage;
