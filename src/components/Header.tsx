'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBasket,
  Menu,
  ChevronRight,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import { useNavigation } from './NavigationContext';
import { useCart } from './CartContext';
import { useWishlist } from './WishlistContext';
import { useCategories } from './useCategories';
import { api } from '../api';
import { Category, Product } from '@/types';
import { CATEGORIES } from '../constants';

let cachedSearchProducts: Product[] | null = null;
let searchProductsPromise: Promise<Product[]> | null = null;

const loadSearchProducts = async (): Promise<Product[]> => {
  if (cachedSearchProducts) return cachedSearchProducts;

  if (!searchProductsPromise) {
    searchProductsPromise = api
      .getProducts('all')
      .then((products) => {
        cachedSearchProducts = products;
        return products;
      })
      .finally(() => {
        searchProductsPromise = null;
      });
  }

  return searchProductsPromise!;
};

const MobileMenuOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <div
    className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    }`}
    onClick={onClose}
  />
);

interface HeaderProps {
  initialCategories?: Category[];
}

const Header: React.FC<HeaderProps> = ({ initialCategories }) => {
  const router = useRouter();
  const { navigateTo } = useNavigation();
  const { totalCount, totalAmount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { categories } = useCategories(initialCategories);

  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLeftMenuOpen || isRightMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLeftMenuOpen, isRightMenuOpen]);

  useEffect(() => {
    const term = searchValue.trim();

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }

    if (!term) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsSuggestionsOpen(true);
    setIsLoadingSuggestions(!cachedSearchProducts);
    setSuggestions([]);

    let isCancelled = false;

    searchDebounceRef.current = setTimeout(() => {
      loadSearchProducts()
        .then((products) => {
          if (isCancelled) return;
          const normalized = term.toLowerCase();
          const next = products
            .filter((product) =>
              [product.name, product.model ?? '', product.brand ?? '']
                .join(' ')
                .toLowerCase()
                .includes(normalized),
            )
            .slice(0, 8);

          setSuggestions(next);
        })
        .catch(() => {
          if (!isCancelled) setSuggestions([]);
        })
        .finally(() => {
          if (!isCancelled) setIsLoadingSuggestions(false);
        });
    }, 200);

    return () => {
      isCancelled = true;
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, [searchValue]);

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    const term = searchValue.trim();
    if (!term) {
      setIsMobileSearchOpen(false);
      return;
    }

    router.push(`/catalog?search=${encodeURIComponent(term)}`);
    setIsSuggestionsOpen(false);
    setSuggestions([]);
    setIsMobileSearchOpen(false);
  };

  const handleSuggestionClick = (product: Product) => {
    const term = (product.name || '').trim();
    if (!term) return;

    setSearchValue(term);
    router.push(`/catalog?search=${encodeURIComponent(term)}`);
    setIsSuggestionsOpen(false);
    setSuggestions([]);
  };

  const categoryList = categories.length > 0 ? categories : CATEGORIES;

  return (
    <header className="w-full flex flex-col font-sans z-50 relative">
      {/* MOBILE HEADER */}
      <div className="lg:hidden bg-white border-b border-gray-100 px-4 h-16 flex items-center justify-between sticky top-0 z-[70]">
        <button
          onClick={() => setIsLeftMenuOpen(true)}
          className="flex flex-col gap-1.5 p-2 focus:outline-none"
        >
          <span className="w-5 h-[2px] bg-black" />
          <span className="w-8 h-[2px] bg-black" />
          <span className="w-5 h-[2px] bg-black" />
        </button>

        <button
          onClick={() => navigateTo('home')}
          className="flex-1 text-center font-extrabold text-lg tracking-tight"
        >
          ОСТРІВ
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push('/cart')}
            className="w-10 h-10 border border-gray-200 rounded-md flex items-center justify-center relative hover:border-amber-400 transition-colors"
          >
            <ShoppingBasket size={20} className="text-black" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            className="w-10 h-10 flex items-center justify-center text-black hover:text-amber-500 transition-colors"
          >
            <Search size={22} />
          </button>

          <button
            onClick={() => setIsRightMenuOpen(true)}
            className="flex flex-col gap-1.5 p-2 focus:outline-none"
          >
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
            <span className="w-6 h-[2px] bg-black" />
          </button>
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 p-4 absolute top-16 left-0 w-full z-[65] shadow-md">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center h-10">
            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Пошук по сайту..."
              className="w-full h-full border border-gray-200 rounded-sm pl-4 pr-12 focus:outline-none focus:border-amber-400 text-sm"
            />
            <button type="submit" className="absolute right-0 h-full w-10 flex items-center justify-center text-amber-500">
              <Search size={18} />
            </button>
          </form>
        </div>
      )}

      <MobileMenuOverlay isOpen={isLeftMenuOpen} onClose={() => setIsLeftMenuOpen(false)} />
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[100] transition-transform duration-300 transform ${
          isLeftMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        <div className="bg-amber-400 p-5 flex items-center justify-between">
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">КАТЕГОРІЇ</h3>
          <button onClick={() => setIsLeftMenuOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-64px)]">
          <ul className="flex flex-col">
            {categoryList.map((cat) => (
              <li key={cat.id} className="border-b border-gray-50">
                <button
                  onClick={() => {
                    setIsLeftMenuOpen(false);
                    if (cat.slug) {
                      navigateTo('catalog', cat.slug);
                    } else {
                      navigateTo('catalog');
                    }
                  }}
                  className="w-full text-left px-6 py-4 text-[14px] text-gray-700 hover:text-amber-500 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  {cat.title}
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <MobileMenuOverlay isOpen={isRightMenuOpen} onClose={() => setIsRightMenuOpen(false)} />
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#2a2a2a] z-[100] transition-transform duration-300 transform ${
          isRightMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } shadow-2xl`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-700">
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">МЕНЮ</h3>
          <button onClick={() => setIsRightMenuOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-2">
          {[
            { label: 'Каталог', page: 'catalog' },
            { label: 'Про компанію', page: 'about' },
            { label: 'Умови оплати та доставки', page: 'delivery' },
            { label: 'Контакти', page: 'contact' },
            { label: 'Список бажань', page: 'wishlist' },
          ].map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setIsRightMenuOpen(false);
                navigateTo(item.page as any);
              }}
              className="text-white text-left font-bold uppercase text-xs py-4 px-4 hover:bg-amber-400 rounded-sm transition-colors tracking-widest"
            >
              {item.label}
            </button>
          ))}

          <div className="mt-8 pt-8 border-t border-gray-700 px-4 flex flex-col gap-6">
            <div className="flex items-center gap-4 text-gray-300">
              <Phone size={20} className="text-amber-400" />
              <div className="flex flex-col text-xs">
                <a href="tel:+380505956273" className="hover:text-white transition-colors">
                  +380505956273
                </a>
                <a href="tel:+380505573395" className="hover:text-white transition-colors">
                  +380505573395
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
              <Mail size={20} className="text-amber-400" />
              <a href="mailto:ostrowtor@gmail.com" className="text-xs hover:text-white transition-colors">
                ostrowtor@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP HEADER */}
      <div className="hidden lg:block bg-white py-5 border-b border-gray-100">
        <div className="w-full max-w-[1352px] mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          <button
            onClick={() => {
              setSearchValue('');
              navigateTo('home');
            }}
            className="flex items-center min-w-fit focus:outline-none"
          >
            <svg width="147" height="45" viewBox="0 0 147 45" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[45px] w-auto">
              {/* logo paths omitted for brevity */}
            </svg>
          </button>

          <div className="flex-1 w-full max-w-3xl mx-4 lg:mx-12" ref={searchRef}>
            <form className="relative flex items-center h-12" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Пошук по сайту..."
                autoComplete="off"
                className="w-full h-full border-2 border-[#E5E5E5] bg-transparent rounded-sm pl-5 pr-14 focus:outline-none focus:border-amber-400 text-gray-600 placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 w-14 bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center rounded-r-sm transition-colors"
              >
                <Search size={20} />
              </button>

              {isSuggestionsOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-b-sm z-50">
                  {isLoadingSuggestions ? (
                    <div className="px-4 py-3 text-sm text-gray-500">Пошук...</div>
                  ) : suggestions.length > 0 ? (
                    <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                      {suggestions.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSuggestionClick(item)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <span className="truncate">{item.name}</span>
                            <span className="text-xs text-gray-500 ml-3 whitespace-nowrap">
                              {item.price.toLocaleString('uk-UA')} ¢'?
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">Нічого не знайдено</div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-4 min-w-fit">
            <Link
              href="/wishlist"
              className="w-12 h-12 flex items-center justify-center text-gray-600 border border-gray-300 rounded-sm hover:border-amber-400 hover:text-amber-500 transition-colors bg-white group relative"
            >
              <Heart size={20} className="group-hover:fill-amber-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-3 border border-gray-300 rounded-sm p-1.5 pr-5 bg-white hover:border-amber-400 transition-colors cursor-pointer group h-12"
            >
              <div className="relative w-9 h-9 flex items-center justify-center text-gray-600 group-hover:text-amber-500">
                <ShoppingBasket size={22} />
                <span className="absolute -top-1 -right-1 bg-amber-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Мій кошик:</span>
                <span className="text-sm font-bold text-amber-500 leading-tight">
                  {totalAmount.toLocaleString('uk-UA').replace(/,/g, ' ')} ¢'?
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block bg-[#2a2a2a] text-white">
        <div className="w-full max-w-[1352px] mx-auto px-4 flex flex-col md:flex-row items-center relative">
          <div className="relative w-full md:w-auto">
            <button
              ref={btnRef}
              onClick={() => setIsCategoriesOpen((prev) => !prev)}
              className="flex items-center justify-between gap-6 bg-[#4a4a4a] hover:bg-[#555] h-14 px-6 text-sm font-bold uppercase tracking-wide transition-colors w-full md:w-auto min-w-[260px]"
            >
              <span>Усі категорії</span>
              <Menu size={20} className="text-gray-300" />
            </button>

            {isCategoriesOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 w-full min-w-[260px] bg-white shadow-xl z-50 border border-gray-100 rounded-b-sm"
              >
                <ul className="py-2">
                  {categoryList.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/catalog${cat.slug ? `?category=${cat.slug}` : ''}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="w-full text-left px-6 py-3 text-sm text-gray-700 hover:text-amber-500 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        {cat.title}
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <nav className="flex-1 w-full md:w-auto">
            <ul className="flex flex-col md:flex-row justify-center md:justify-start items-center">
              <li>
                <button
                  onClick={() => {
                    setSearchValue('');
                    navigateTo('catalog');
                  }}
                  className="block py-4 px-8 text-[12px] font-bold hover:text-amber-400 transition-colors uppercase tracking-wider"
                >
                  Каталог
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="block py-4 px-8 text-[12px] font-bold hover:text-amber-400 transition-colors uppercase tracking-wider"
                >
                  Про компанію
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('delivery')}
                  className="block py-4 px-8 text-[12px] font-bold hover:text-amber-400 transition-colors uppercase tracking-wider"
                >
                  Умови оплати та доставки
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="block py-4 px-8 text-[12px] font-bold hover:text-amber-400 transition-colors uppercase tracking-wider"
                >
                  Контакти
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
