
import React from 'react';
import { FEATURES } from '../constants';

const Features: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="w-full max-w-[1352px] mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-5 group cursor-default">
              <div className="w-[70px] h-[70px] flex-shrink-0 border border-[#E5E5E5] rounded-[3px] flex items-center justify-center group-hover:border-amber-400 transition-colors duration-300">
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-[#282828] text-[13px] uppercase mb-1 leading-tight group-hover:text-amber-500 transition-colors">
                    {feature.title}
                </h4>
                <p className="text-[#8C8C8C] text-[12px] leading-snug">
                    {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
