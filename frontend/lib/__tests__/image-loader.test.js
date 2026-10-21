import { describe, expect, it } from 'vitest';

import imageLoader from '@/lib/image-loader';

describe('image loader', () => {
  it('serves the smallest thumbnail at least as wide as asked', () => {
    expect(imageLoader({ src: '/images/neon-1.jpg', width: 64 })).toBe('/_thumbs/128/images/neon-1.jpg.webp');
    expect(imageLoader({ src: '/images/neon-1.jpg', width: 384 })).toBe('/_thumbs/384/images/neon-1.jpg.webp');
    expect(imageLoader({ src: '/hero-aquascape.jpg', width: 1080 })).toBe('/_thumbs/1280/hero-aquascape.jpg.webp');
  });

  it('serves the stored photo above the largest thumbnail', () => {
    expect(imageLoader({ src: '/images/neon-1.jpg', width: 1920 })).toBe('/images/neon-1.jpg');
  });

  it('leaves vector images and remote addresses alone', () => {
    expect(imageLoader({ src: '/icon.svg', width: 64 })).toBe('/icon.svg');
    expect(imageLoader({ src: 'https://example.org/a.jpg', width: 64 })).toBe('https://example.org/a.jpg');
  });
});
