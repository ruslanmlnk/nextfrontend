'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/api';
import { Category } from '@/types';
import logo from '../../public/logo_footer.svg'

import location from '../../public/img/location.svg'
import phone from '../../public/img/phone.svg'
import post from '../../public/img/post.svg'
import viber from '../../public/img/viber.svg'


import instagram from '../../public/img/instagram.svg'
import facebook from '../../public/img/facebook.svg'

import Image from 'next/image';


const Footer: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    api.getCategories().then((cats) => {
      if (!cancelled) setCategories(cats);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [leftCats, rightCats] = useMemo(() => {
    if (!categories.length) return [[], []] as [Category[], Category[]];
    const half = Math.ceil(categories.length / 2);
    return [categories.slice(0, half), categories.slice(half)] as [Category[], Category[]];
  }, [categories]);

  return (
    <footer className="bg-[#282828] text-[#878787] pt-12 pb-8 border-t border-gray-800 font-sans">
      <div className="w-full max-w-[1352px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 my-[100px]">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <Link href="/" className="inline-block focus:outline-none w-fit">
              <Image src={logo} alt="Острів Лого" className="h-[40px] w-auto" />
            </Link>
            <div className="flex flex-col gap-2">
              <h5 className="text-white font-medium text-[16px] uppercase leading-none mb-2">ГРАФІК РОБОТИ</h5>
              <p className="text-[16px] leading-[1.3] text-[#878787]">
                Будні: 09:00-19:00 <br />
                Сб: 09:00-18:00 <br />
                Нд: вихідний
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h5 className="text-white font-medium text-[16px] uppercase leading-none mb-6">ОСНОВНЕ</h5>
            <ul className="space-y-[11px] text-[16px]">
              <li>
                <Link href="/" className="hover:text-white transition-colors leading-none block text-left">
                  Головна сторінка
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-white transition-colors leading-none block text-left">
                  Умови оплати та доставки
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors leading-none block text-left">
                  Про компанію
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h5 className="text-white font-medium text-[16px] uppercase leading-none mb-6">КАТАЛОГ</h5>
            <div className="grid grid-cols-2 gap-4 text-[16px]">
              <ul className="space-y-[11px]">
                {leftCats.length === 0 && <li className="text-[#666]">Категорії завантажуються…</li>}
                {leftCats.map((cat) => (
                  <li key={cat.slug || cat.id}>
                    <Link
                      href={cat.slug ? `/catalog?category=${encodeURIComponent(cat.slug)}` : '/catalog'}
                      className="hover:text-white transition-colors leading-none block text-left"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-[11px]">
                {rightCats.map((cat) => (
                  <li key={cat.slug || cat.id}>
                    <Link
                      href={cat.slug ? `/catalog?category=${encodeURIComponent(cat.slug)}` : '/catalog'}
                      className="hover:text-white transition-colors leading-none block text-left"
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h5 className="text-white font-medium text-[16px] uppercase leading-none mb-6">КОНТАКТНА ІНФОРМАЦІЯ</h5>
            <div className="space-y-4 text-[16px]">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8  flex items-center justify-center flex-shrink-0">
                  <Image src={phone} alt="Phone" className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <a
                    href="tel:+380505956273"
                    className="hover:text-white transition-colors leading-tight mb-1 block text-left"
                  >
                    +380505956273
                  </a>
                  <a
                    href="tel:+380505956273"
                    className="hover:text-white transition-colors leading-tight block text-left"
                  >
                    +380505956273
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8  flex items-center justify-center flex-shrink-0">
                  <Image src={viber} alt="Viber" className="w-6 h-6" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <a
                    href="tel:+380505573395"
                    className="hover:text-white transition-colors leading-tight block text-left"
                  >
                    +380505573395
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8  flex items-center justify-center flex-shrink-0">
                  <Image src={post} alt="Email" className="w-6 h-6" />
                </div>
                <div className="flex flex-col pt-1.5">
                  <a
                    href="mailto:ostrowtor@gmail.com"
                    className="hover:text-white transition-colors leading-tight block text-left"
                  >
                    ostrowtor@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8  flex items-center justify-center flex-shrink-0">
                  <Image src={location} alt="Location" className="w-6 h-6" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="leading-tight block text-left">
                    м.Київ с.Вішневе <br /> вул.Чорновола,1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#989898] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[16px] text-[#878787] leading-none">© 2025 Острів. Усі права захищені.</p>
          <div className="flex gap-2">
            <a
              href="#"
              className="flex items-center justify-center hover:border-white transition-colors group"
            >
              <Image
                src={facebook}
                alt="Facebook"
                className="w-9 h-9 opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="#"
              className="flex items-center justify-center hover:border-white transition-colors group"
            >
              <Image
                src={instagram}
                alt="Instagram"
                className="w-9 h-9 opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
