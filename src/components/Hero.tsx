'use client';

import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="w-full max-w-[1352px] mx-auto px-4 mt-8">
      <div 
        className="relative w-full h-[400px] md:h-[550px] bg-cover bg-center rounded-lg overflow-hidden shadow-sm"
        style={{ backgroundImage: 'url("/img/heromain.png")' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <span className="text-amber-400 font-extrabold tracking-[0.2em] text-xs md:text-sm uppercase mb-4 drop-shadow-md">
            Стильні меблі та товари для дому
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-tight max-w-5xl drop-shadow-xl">
            побутова техніка для дому
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
