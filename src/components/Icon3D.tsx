import React from 'react';
import { getFluentEmojiUrl } from '../lib/fluentEmoji';

interface Icon3DProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

export default function Icon3D({ name, size = 24, className = '', alt }: Icon3DProps) {
  const url = getFluentEmojiUrl(name);
  if (!url) return null;

  return (
    <img
      src={url}
      alt={alt || name}
      width={size}
      height={size}
      className={`inline-block flex-shrink-0 ${className}`}
      loading="lazy"
      draggable={false}
    />
  );
}
