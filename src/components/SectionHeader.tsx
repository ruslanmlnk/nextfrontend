'use client';

import React from 'react';

interface SectionHeaderProps {
  subtitle: string;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ subtitle, title }) => {
  return (
    <div className="text-center mb-10">
      <h3 className="text-amber-500 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">{subtitle}</h3>
      <div className="flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-gray-900">{title}</h2>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
      </div>
    </div>
  );
};

export default SectionHeader;
