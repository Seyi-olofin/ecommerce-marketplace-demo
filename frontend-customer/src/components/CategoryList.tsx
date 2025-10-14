import React, { useEffect, useState } from 'react';
import { getCategories, BACKEND_ORIGIN } from '../lib/api';

export default function CategoryList() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCategories();
        const normalized = (data || []).map((c) => {
          if (typeof c === 'string') {
            return { name: c, slug: c.toLowerCase().replace(/\s+/g, '-'), image: '/images/category-placeholder.svg' };
          }
          return c;
        });
        if (mounted) setCategories(normalized);
      } catch (err) {
        console.error('Error fetching categories', err);
        if (mounted) setError(err.message || 'Failed to load categories');
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!categories) return <div>Loading categories…</div>;
  if (!categories.length) return <div>No categories found</div>;

  const placeholder = `${BACKEND_ORIGIN}/images/category-placeholder.svg`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat, i) => {
        const key = cat._id || cat.id || cat.slug || `${cat.name}-${i}`;
        const title = cat.name || (typeof cat === 'string' ? cat : 'Category');
        let img = cat.image || cat.thumbnail || (cat.metadata && cat.metadata.thumbnail) || placeholder;
        if (typeof img === 'string') {
          if (img.startsWith('/images')) {
            img = `${BACKEND_ORIGIN}${img}`;
          } else if (!/^https?:\/\//i.test(img)) {
            img = `${BACKEND_ORIGIN}/${img.replace(/^\/+/, '')}`;
          }
        } else {
          img = placeholder;
        }

        return (
          <div key={key} className="bg-white rounded shadow overflow-hidden">
            <img
              src={img}
              alt={title}
              className="w-full h-40 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = placeholder;
              }}
            />
            <div className="p-3">
              <h3 className="font-semibold text-lg">{title}</h3>
              {cat.description && <p className="text-sm text-gray-600 mt-1">{cat.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}