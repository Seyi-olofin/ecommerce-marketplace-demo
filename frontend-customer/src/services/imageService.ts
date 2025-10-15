// CDN Configuration
const CDN_BASE_URL = 'https://images.unsplash.com';
const FALLBACK_IMAGES = {
  placeholder: '/images/placeholder.jpg',
  categories: {
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&crop=center',
    'mens-shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
    laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&crop=center',
    'womens-fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop&crop=center',
    'beauty-skincare': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&crop=center',
    'home-garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
    sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
    automotive: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop&crop=center',
    motorcycle: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=600&fit=crop&crop=center',
    shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center'
  }
};

// Image optimization and CDN service
export class ImageService {
  private static cache = new Map<string, string>();

  // Get optimized image URL with CDN
  static getOptimizedImage(url: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  } = {}): string {
    if (!url) return FALLBACK_IMAGES.placeholder;

    const { width = 600, height = 600, quality = 80, format = 'webp' } = options;

    // If it's already an Unsplash URL, optimize it
    if (url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}w=${width}&h=${height}&fit=crop&crop=center&q=${quality}&fm=${format}`;
    }

    // For local images, return as-is (they're already optimized)
    if (url.startsWith('/images/')) {
      return url;
    }

    // For other external URLs, try to proxy through CDN
    try {
      const encodedUrl = encodeURIComponent(url);
      return `${CDN_BASE_URL}/?url=${encodedUrl}&w=${width}&h=${height}&fit=crop&crop=center&q=${quality}&fm=${format}`;
    } catch {
      return url;
    }
  }

  // Get category image with CDN optimization
  static getCategoryImage(categorySlug: string): string {
    const normalizedSlug = categorySlug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return FALLBACK_IMAGES.categories[normalizedSlug] || FALLBACK_IMAGES.categories.electronics;
  }

  // Get product image with multiple fallbacks
  static async getProductImage(category: string, title: string, index: number = 0): Promise<string> {
    const cacheKey = `${category}-${title}-${index}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try local images first (highest priority)
      const localImagePath = `/images/${category}/${category}${index + 1}.jpg`;
      const localResponse = await fetch(localImagePath, { method: 'HEAD' });
      if (localResponse.ok) {
        this.cache.set(cacheKey, localImagePath);
        return localImagePath;
      }
    } catch {
      // Local image not found, continue to external sources
    }

    // Generate high-quality Unsplash image based on product title and category
    const searchTerm = `${title} ${category}`.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const unsplashUrl = `https://images.unsplash.com/600x600/?${encodeURIComponent(searchTerm)},product,${category}&w=600&h=600&fit=crop&crop=center&auto=format&q=80`;

    this.cache.set(cacheKey, unsplashUrl);
    return unsplashUrl;
  }

  // Preload images for better performance
  static preloadImages(urls: string[]): void {
    urls.forEach(url => {
      if (url && !url.includes('placeholder')) {
        const img = new Image();
        img.src = this.getOptimizedImage(url, { width: 400, height: 400 });
      }
    });
  }

  // Get image dimensions (for lazy loading optimization)
  static async getImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  // Batch optimize multiple images
  static optimizeImageBatch(urls: string[], options: Parameters<typeof this.getOptimizedImage>[1] = {}): string[] {
    return urls.map(url => this.getOptimizedImage(url, options));
  }
}

// Legacy export for backward compatibility
export async function getProductImage(category: string, title: string): Promise<string> {
  // Return a promise-compatible version for existing code
  try {
    return await ImageService.getProductImage(category, title);
  } catch {
    return FALLBACK_IMAGES.placeholder;
  }
}

// Export the service class
export { ImageService as default };