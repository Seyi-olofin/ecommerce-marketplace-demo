import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ProductCard from "@/components/ProductCard";
import { cachedApi, Product } from "@/lib/api";

// Import static products data
import staticProducts from "@/data/products.json";

const CategoryProducts = () => {
   const { categorySlug } = useParams<{ categorySlug: string }>();
   const { formatPrice } = useCurrency();
   const { t, isTranslating } = useI18n();
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const loadProducts = async () => {
       if (!categorySlug) return;

       try {
         setLoading(true);

         // First try to get products from backend API
         try {
           const apiResponse = await cachedApi.getProducts(`category=${categorySlug}&limit=20`);
           const apiProducts = Array.isArray(apiResponse) ? apiResponse : apiResponse.products || [];
           if (apiProducts && apiProducts.length > 0) {
             // Ensure products have proper image URLs from API
             const productsWithImages = apiProducts.map(product => ({
               ...product,
               thumbnail: product.thumbnail || product.images?.[0] || '/images/placeholder.jpg'
             }));
             setProducts(productsWithImages);
             setLoading(false);
             return;
           }
         } catch (apiError) {
           console.warn('API failed for category products, using static data:', apiError);
         }

         // Fallback to static data if API fails or returns empty
         const categoryProducts = staticProducts.filter(product => product.category === categorySlug);

         if (categoryProducts && categoryProducts.length > 0) {
           // Load real images for products immediately
           const productsWithRealImages = await Promise.all(
             categoryProducts.map(async (product) => {
               // Always try to get real image from Unsplash for better UX
               try {
                 const { getProductImage } = await import('@/services/imageService');
                 const realImage = await getProductImage(product.category, product.title);
                 return {
                   ...product,
                   thumbnail: realImage
                 };
               } catch (error) {
                 // Fallback to local image if API fails
                 // Use the correct local image path from products.json
                 return {
                   ...product,
                   thumbnail: product.thumbnail // Already has correct path from products.json
                 };
               }
             })
           );
           setProducts(productsWithRealImages);
         } else {
           setProducts([]);
         }
       } catch (error) {
         console.error('Error loading category products:', error);
         setProducts([]);
       } finally {
         setLoading(false);
       }
     };

     loadProducts();
   }, [categorySlug]);

  const getCategoryTitle = (slug: string) => {
    const categoryTitles: Record<string, string> = {
      'fashion': 'Fashion & Clothing',
      'electronics': 'Electronics & Gadgets',
      'home-garden': 'Home & Garden',
      'beauty-skincare': 'Beauty & Skincare',
      'sports': 'Sports & Fitness',
      'automotive': 'Automotive',
      'mens-watches': 'Men\'s Watches',
      'shoes': 'Shoes & Footwear',
      'laptops': 'Laptops & Computers',
      'motorcycle': 'Motorcycle & Parts',
      'mens-shirts': 'Men\'s Shirts',
      'womens-fashion': 'Women\'s Fashion'
    };
    return categoryTitles[slug] || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="container px-4 md:px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-gray-900">
              {getCategoryTitle(categorySlug || '')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our premium collection of {getCategoryTitle(categorySlug || '').toLowerCase()} products
            </p>
            {isTranslating && (
              <div className="text-sm text-muted-foreground">Translating...</div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container px-4 md:px-6 py-12 md:py-16 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-light tracking-tight text-gray-900">
                {getCategoryTitle(categorySlug || '')} Collection
              </h2>
              <p className="text-muted-foreground mt-2">
                {products.length} premium product{products.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.title}
                    description={product.description}
                    price={product.price.amount}
                    currency={product.price.currency}
                    rating={product.rating}
                    image={product.thumbnail}
                    source={product.source}
                    product={product}
                    showDescription={true}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-medium mb-3 text-gray-900">No products found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We're currently updating our {getCategoryTitle(categorySlug || '').toLowerCase()} collection.
                Check back soon for new arrivals!
              </p>
              <Button size="lg" className="shadow-lg">
                Browse All Categories
              </Button>
            </div>
          )}
        </motion.div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default CategoryProducts;