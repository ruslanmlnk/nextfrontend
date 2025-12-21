'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useCategories } from './useCategories';

const SidebarCategories: React.FC = () => {
  const { categories } = useCategories();

  return (
    <div className="w-full border border-gray-100 rounded-sm bg-white mb-6">
      {/* Header */}
      <div className="bg-amber-400 p-4">
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Категорії товарів</h3>
      </div>

      {/* List */}
      <ul className="py-2">
        {categories.map((cat) => (
          <li key={cat.id} className="border-b border-gray-50 last:border-0">
            <Link
              href={`/catalog?category=${cat.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-gray-800 text-xs font-bold uppercase"
            >
              <span className="group-hover:text-amber-500">{cat.title}</span>
              <ChevronRight size={12} className="text-gray-300 group-hover:text-amber-500" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarCategories;
