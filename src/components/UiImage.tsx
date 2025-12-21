'use client';

import Image from 'next/image';
import React from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
};

// Simple wrapper over next/image to avoid layout changes.
const UiImage: React.FC<Props> = ({
  src,
  alt,
  className,
  width = 800,
  height = 600,
  priority = false,
  sizes = '100vw',
}) => {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized
    />
  );
};

export default UiImage;
