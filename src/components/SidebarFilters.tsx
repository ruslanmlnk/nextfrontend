'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCategories } from './useCategories';
import { useNavigation } from './NavigationContext';
import { useBrands } from './useBrands';
import { useColors } from './useColors';

interface FilterOption {
  label: string;
  slug?: string;
  count: number;
  checked?: boolean;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  hasSearch?: boolean;
  onChange?: (option: FilterOption) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  options,
  hasSearch,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions =
    hasSearch && searchTerm.trim().length > 0
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.trim().toLowerCase()),
        )
      : options;

  return (
    <div className="border-b border-gray-100 last:border-0 py-5 px-5">
      <div
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-bold uppercase text-gray-900">{title}</h4>
        {/* Triangle arrow styling */}
        <div
          className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-amber-400 transition-transform ${
            isOpen ? '' : 'rotate-180'
          }`}
        ></div>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {hasSearch && (
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Пошук"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-sm py-2 pl-3 pr-8 text-sm focus:outline-none focus:border-amber-400 placeholder-gray-400 text-gray-900"
              />
              <Search
                size={16}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          )}

          <ul className="space-y-3">
            {filteredOptions.map((opt, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between group cursor-pointer"
              >
                <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      {...(onChange
                        ? { checked: Boolean(opt.checked) }
                        : { defaultChecked: Boolean(opt.checked) })}
                      onChange={onChange ? () => onChange(opt) : undefined}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-sm border border-gray-200 transition-all checked:border-amber-400 checked:bg-amber-400 hover:border-amber-400 bg-white"
                    />
                    <svg
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm group-hover:text-amber-500 transition-colors">
                    {opt.label}
                  </span>
                </label>
                <span className="text-[11px] text-gray-500 border border-gray-200 rounded-[3px] px-1.5 min-w-[30px] h-[22px] flex items-center justify-center bg-white">
                  {opt.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface SidebarFiltersProps {
  selectedSlug?: string;
  categoryCounts?: Record<string, number>;
  brandCounts?: Record<string, number>;
  colorCounts?: Record<string, number>;
  selectedBrands?: string[];
  selectedColors?: string[];
  onSelectCategory?: (slug?: string) => void;
  onToggleBrand?: (option: FilterOption) => void;
  onToggleColor?: (option: FilterOption) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedSlug,
  categoryCounts,
  brandCounts,
  colorCounts,
  selectedBrands,
  selectedColors,
  onSelectCategory,
  onToggleBrand,
  onToggleColor,
}) => {
  const { categories } = useCategories();
  const { navigateTo } = useNavigation();
  const { brands } = useBrands();
  const { colors } = useColors();

  const categoryOptions: FilterOption[] = categories.map((cat) => ({
    label: cat.title,
    slug: cat.slug,
    count: categoryCounts?.[cat.slug] ?? 0,
    checked: selectedSlug ? cat.slug === selectedSlug : false,
  }));

  const brandOptions: FilterOption[] = brands.map((brand) => ({
    label: brand.title,
    slug: brand.slug,
    count: brandCounts?.[(brand.slug || brand.title || '').trim().toLowerCase()] ?? 0,
    checked: selectedBrands?.includes((brand.slug || brand.title || '').trim().toLowerCase()),
  }));

  const colorOptions: FilterOption[] = colors.map((color) => ({
    label: color.title,
    slug: color.slug,
    count: colorCounts?.[(color.slug || color.title || '').trim().toLowerCase()] ?? 0,
    checked: selectedColors?.includes((color.slug || color.title || '').trim().toLowerCase()),
  }));

  const handleCategoryChange = (opt: FilterOption) => {
    const nextSlug = selectedSlug === opt.slug ? undefined : opt.slug;
    if (onSelectCategory) {
      onSelectCategory(nextSlug);
    } else {
      navigateTo('catalog', nextSlug);
    }
  };

  const handleBrandChange = (opt: FilterOption) => {
    onToggleBrand?.(opt);
  };

  const handleColorChange = (opt: FilterOption) => {
    onToggleColor?.(opt);
  };

  return (
    <div className="w-full border border-gray-100 rounded-sm bg-white">
      {/* Header */}
      <div className="bg-amber-400 py-4 px-6">
        <h3 className="text-white font-bold uppercase text-sm tracking-widest">
          Фільтри
        </h3>
      </div>

      {/* Categories */}
      <FilterGroup
        title="Категорії товарів"
        hasSearch
        options={categoryOptions.map((opt) => ({
          ...opt,
          checked: selectedSlug ? opt.slug === selectedSlug : opt.checked,
        }))}
        onChange={handleCategoryChange}
      />

      {/* Manufacturer */}
      <FilterGroup title="Бренд" options={brandOptions} onChange={handleBrandChange} />

      {/* Color */}
      <FilterGroup title="Колір" options={colorOptions} onChange={handleColorChange} />
    </div>
  );
};

export default SidebarFilters;
