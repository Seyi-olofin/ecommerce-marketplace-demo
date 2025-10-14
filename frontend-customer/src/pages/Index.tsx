import { Smartphone, Shirt, Home, Sparkles, Package, Globe, ShieldCheck, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import CategoryPreviewSection from "@/components/CategoryPreviewSection";
import ValueProposition from "@/components/ValueProposition";
import TestimonialCard from "@/components/TestimonialCard";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { CategoryListSkeleton, ProductGridSkeleton } from "@/components/ProductSkeleton";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getCategories, getProducts, cachedApi, Category, Product } from "@/lib/api";
import { getProductImage } from "@/services/imageService";
import { useI18n } from "@/contexts/I18nContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import staticProducts from "@/data/products.json";

// Category image mapping - using real images from APIs with proper fallbacks
const categoryImages = {
  'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&crop=center',
  'mens-shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
  'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&crop=center',
  'womens-fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop&crop=center',
  'beauty-skincare': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&crop=center',
  'home-garden': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
  'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop&crop=center',
  'automotive': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop&crop=center',
  'motorcycle': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=600&fit=crop&crop=center',
  'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=600&fit=crop&crop=center',
  'mens-watches': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop&crop=center',
  'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center'
};

// Normalize category names to slugs
function normalizeCategory(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Get category image with fallback
function getCategoryImage(category) {
  const key = normalizeCategory(category);
  console.log('Index - getting image for category:', category, 'normalized key:', key, 'image:', categoryImages[key]);
  return categoryImages[key] || '/images/placeholder.jpg';
}

const Index = () => {
    const { t, isTranslating } = useI18n();
    const { formatPrice } = useCurrency();
    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
    const [generalProducts, setGeneralProducts] = useState<Product[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [loadingTopSelling, setLoadingTopSelling] = useState(true);
    const [loadingFlashSales, setLoadingFlashSales] = useState(true);
    const [loadingGeneral, setLoadingGeneral] = useState(false);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [currentOffset, setCurrentOffset] = useState(0);
    const PRODUCTS_PER_PAGE = 12;

    // Define category display order and names
    const categoryDisplayOrder = [
      { slug: 'electronics', name: 'Electronics' },
      { slug: 'mens-shirts', name: 'Men\'s Shirts' },
      { slug: 'womens-fashion', name: 'Women\'s Fashion' },
      { slug: 'shoes', name: 'Shoes' },
      { slug: 'sports', name: 'Sports' },
      { slug: 'beauty-skincare', name: 'Beauty & Skincare' },
      { slug: 'home-garden', name: 'Home & Garden' },
      { slug: 'laptops', name: 'Laptops' },
      { slug: 'automotive', name: 'Automotive' },
      { slug: 'motorcycle', name: 'Motorcycle' }
    ];

    // Get products by category from static data
    const getProductsByCategory = (categorySlug: string): Product[] => {
      return staticProducts.filter(product => product.category === categorySlug);
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        console.log('Fetching categories...');
        const categoriesData = await cachedApi.getCategories();
        console.log('Categories received:', categoriesData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoadingCategories(false);

        // Use real categories from API, with fallback if needed
        console.log('Using real categories from API...');
        if (categoriesData && categoriesData.length > 0) {
          // Map API categories to our expected format
          const mappedCategories = categoriesData.slice(0, 8).map(cat => {
            const image = cat.image || getCategoryImage(cat.name);
            console.log('Index - mapping category:', cat.name, 'to image:', image);
            return {
              id: cat.id,
              name: cat.name,
              image: image
            };
          });
          setCategories(mappedCategories);
        } else {
          // Fallback categories only if API fails completely
          console.log('API returned no categories, using fallback...');
          const fallbackCategories = [
            { id: 'electronics', name: 'Electronics', image: getCategoryImage('electronics') },
            { id: 'mens-shirts', name: 'Men\'s Shirts', image: getCategoryImage('mens-shirts') },
            { id: 'mens-watches', name: 'Men\'s Watches', image: getCategoryImage('mens-watches') },
            { id: 'beauty-skincare', name: 'Beauty & Skincare', image: getCategoryImage('beauty-skincare') },
            { id: 'home-garden', name: 'Home & Garden', image: getCategoryImage('home-garden') },
            { id: 'sports', name: 'Sports', image: getCategoryImage('sports') },
            { id: 'automotive', name: 'Automotive', image: getCategoryImage('automotive') },
            { id: 'womens-fashion', name: 'Women\'s Fashion', image: getCategoryImage('womens-fashion') }
          ];
          console.log('Index - fallback categories:', fallbackCategories);
          setCategories(fallbackCategories);
        }

        // Use local static data with real Unsplash images (same as category pages)
        console.log('Loading products from local static data with real images...');

        // Featured products - get from local data with real images
        try {
          const featuredProducts = await Promise.all(
            staticProducts.slice(0, 6).map(async (product) => {
              try {
                const realImage = await getProductImage(product.category, product.title);
                return {
                  ...product,
                  price: { amount: product.price.amount, currency: product.price.currency },
                  thumbnail: realImage
                };
              } catch (error) {
                return {
                  ...product,
                  price: { amount: product.price.amount, currency: product.price.currency },
                  thumbnail: product.thumbnail // Fallback to local path
                };
              }
            })
          );
          console.log('Featured products loaded:', featuredProducts.length);
          setFeaturedProducts(featuredProducts);
        } catch (error) {
          console.error('Failed to load featured products:', error);
          setFeaturedProducts([]);
        }
        setLoadingFeatured(false);

        // Top-selling products - get from local data with real images
        try {
          const topSellingProducts = await Promise.all(
            staticProducts.slice(6, 12).map(async (product) => {
              try {
                const realImage = await getProductImage(product.category, product.title);
                return {
                  ...product,
                  price: { amount: product.price.amount, currency: product.price.currency },
                  thumbnail: realImage
                };
              } catch (error) {
                return {
                  ...product,
                  price: { amount: product.price.amount, currency: product.price.currency },
                  thumbnail: product.thumbnail // Fallback to local path
                };
              }
            })
          );
          console.log('Top-selling products loaded:', topSellingProducts.length);
          setTopSellingProducts(topSellingProducts);
        } catch (error) {
          console.error('Failed to load top-selling products:', error);
          setTopSellingProducts([]);
        }
        setLoadingTopSelling(false);

        // Flash sale products - get from local data with real images and discount
        try {
          const flashSaleProducts = await Promise.all(
            staticProducts.slice(12, 18).map(async (product) => {
              try {
                const realImage = await getProductImage(product.category, product.title);
                return {
                  ...product,
                  price: { amount: product.price.amount, currency: product.price.currency },
                  isFlashSale: true,
                  discountPercentage: 20,
                  thumbnail: realImage
                };
              } catch (error) {
                return {
                  ...product,
                  price: { amount: product.price.amount, currency: product.price.currency },
                  isFlashSale: true,
                  discountPercentage: 20,
                  thumbnail: product.thumbnail // Fallback to local path
                };
              }
            })
          );
          console.log('Flash sale products loaded:', flashSaleProducts.length);
          setFlashSaleProducts(flashSaleProducts);
        } catch (error) {
          console.error('Failed to load flash sale products:', error);
          setFlashSaleProducts([]);
        }
        setLoadingFlashSales(false);

        // Fetch initial general products from local data
        await loadMoreProducts(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays as fallback
        setCategories([]);
        setFeaturedProducts([]);
        setTopSellingProducts([]);
        setFlashSaleProducts([]);
        setLoadingCategories(false);
        setLoadingFeatured(false);
        setLoadingTopSelling(false);
        setLoadingFlashSales(false);
      }
    };
    fetchData();
  }, []);

  const loadMoreProducts = async (reset = false) => {
      try {
        setLoadingGeneral(true);
        const offset = reset ? 0 : currentOffset;

        // Use local static data with real images (same as category pages)
        let products = [];
        try {
          const startIndex = offset;
          const endIndex = startIndex + PRODUCTS_PER_PAGE;
          const slicedProducts = staticProducts.slice(startIndex, endIndex);

          products = await Promise.all(
            slicedProducts.map(async (product) => {
              try {
                const realImage = await getProductImage(product.category, product.title);
                return {
                  ...product,
                  price: { amount: product.price.amount, currency: product.price.currency },
                  thumbnail: realImage
                };
              } catch (error) {
                return {
                  ...product,
                  price: { amount: product.price.amount, currency: product.price.currency },
                  thumbnail: product.thumbnail // Fallback to local path
                };
              }
            })
          );
          console.log('Loaded general products with real images:', products.length, 'from offset', offset);
        } catch (error) {
          console.error('Failed to load products from local data:', error);
          products = [];
        }

        if (reset) {
          setGeneralProducts(products);
          setCurrentOffset(PRODUCTS_PER_PAGE);
        } else {
          setGeneralProducts(prev => [...prev, ...products]);
          setCurrentOffset(prev => prev + PRODUCTS_PER_PAGE);
        }

        // Check if there are more products
        setHasMoreProducts(products.length === PRODUCTS_PER_PAGE);
      } catch (error) {
        console.error('Error loading more products:', error);
      } finally {
        setLoadingGeneral(false);
      }
    };


  const valueProps = [
     {
       icon: Globe,
       title: "Worldwide Shipping",
       description: "Fast and reliable delivery to over 200 countries",
     },
     {
       icon: ShieldCheck,
       title: "Secure Payments",
       description: "Credit cards, crypto, and more payment options",
     },
     {
       icon: Package,
       title: "Quality Guaranteed",
       description: "Direct sourcing from a single trusted vendor",
     },
     {
       icon: RotateCcw,
       title: "Easy Returns",
       description: "30-day hassle-free return policy",
     },
   ];


  const [translatedValueProps, setTranslatedValueProps] = useState(valueProps);
  const [translatedTestimonials, setTranslatedTestimonials] = useState([]);
  const [translatedTitles, setTranslatedTitles] = useState<Record<string, string>>({});

  const testimonials = [
     {
       name: "Sarah Johnson",
       rating: 5,
       review: "Amazing shopping experience! The quality of products exceeded my expectations and shipping was incredibly fast.",
       verified: true,
     },
     {
       name: "Michael Chen",
       rating: 5,
       review: "Love the crypto payment option. The interface is smooth and customer service is top-notch.",
       verified: true,
     },
     {
       name: "Emma Williams",
       rating: 4,
       review: "Great selection of products. Prices are competitive and the packaging was excellent.",
       verified: true,
     },
   ];

  // Initialize translated testimonials
  useEffect(() => {
     setTranslatedTestimonials(testimonials);
   }, []);

  // Translate page titles and content when language changes
  useEffect(() => {
    const translateContent = async () => {
      if (isTranslating) return; // Don't translate while already translating

      try {
        const titlesToTranslate = {
          shopByCategory: "Shop by Category",
          exploreCollections: "Explore our curated collections",
          featuredProducts: "Featured Products",
          handpickedSelections: "Handpicked premium selections",
          topSellers: "Top Sellers",
          mostPopular: "Most popular products this week",
          customerSay: "What Our Customers Say",
          trustedWorldwide: "Trusted by thousands worldwide",
          moreProducts: "More Products",
          completeCollection: "Explore our complete collection"
        };

        const translatedTitlesObj = {};
        for (const [key, text] of Object.entries(titlesToTranslate)) {
          translatedTitlesObj[key] = await t(text);
        }
        setTranslatedTitles(translatedTitlesObj);

        // Translate value propositions
        const translatedProps = await Promise.all(
          valueProps.map(async (prop) => ({
            ...prop,
            title: await t(prop.title),
            description: await t(prop.description)
          }))
        );
        setTranslatedValueProps(translatedProps);

        // Translate testimonials
        const translatedTestimonialList = await Promise.all(
          testimonials.map(async (testimonial) => ({
            ...testimonial,
            review: await t(testimonial.review)
          }))
        );
        setTranslatedTestimonials(translatedTestimonialList);

      } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original content
        setTranslatedTitles({
          shopByCategory: "Shop by Category",
          exploreCollections: "Explore our curated collections",
          featuredProducts: "Featured Products",
          handpickedSelections: "Handpicked premium selections",
          topSellers: "Top Sellers",
          mostPopular: "Most popular products this week",
          customerSay: "What Our Customers Say",
          trustedWorldwide: "Trusted by thousands worldwide",
          moreProducts: "More Products",
          completeCollection: "Explore our complete collection"
        });
        setTranslatedValueProps(valueProps);
        setTranslatedTestimonials(testimonials);
      }
    };

    translateContent();
  }, [t, isTranslating]);

  return (
    <div className="min-h-screen w-full pb-20 md:pb-0">
      <Header />
      <Hero />

      {/* Shop by Categories Header */}
      <motion.section
        className="container px-4 md:px-6 py-12 md:py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3">
            Shop by Categories
          </h2>
          <p className="text-muted-foreground font-light">
            Explore top picks from every category
          </p>
        </div>
      </motion.section>

      {/* Category Preview Sections */}
      {categoryDisplayOrder.map((category, index) => {
        const categoryProducts = getProductsByCategory(category.slug);
        console.log('Index - category:', category.name, 'slug:', category.slug, 'products:', categoryProducts.length);
        if (categoryProducts.length === 0) return null;

        return (
          <CategoryPreviewSection
            key={category.slug}
            categoryName={category.name}
            categorySlug={category.slug}
            products={categoryProducts}
            loading={false}
            maxProducts={10}
          />
        );
      })}

      {/* Value Propositions */}
      <section className="w-full gradient-subtle py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {translatedValueProps.map((prop, index) => (
               <ValueProposition key={index} {...prop} />
             ))}
           </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-secondary/30 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3">{translatedTitles.customerSay || "What Our Customers Say"}</h2>
            <p className="text-muted-foreground font-light">{translatedTitles.trustedWorldwide || "Trusted by thousands worldwide"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
             {translatedTestimonials.map((testimonial, index) => (
               <TestimonialCard key={index} {...testimonial} />
             ))}
           </div>
         </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3">{translatedTitles.featuredProducts || "Featured Products"}</h2>
          <p className="text-muted-foreground font-light">{translatedTitles.handpickedSelections || "Handpicked premium selections"}</p>
        </div>
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 overflow-x-auto gap-4 md:gap-6 md:overflow-visible pb-4 md:pb-0">
          {loadingFeatured ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-muted aspect-square rounded-lg min-w-[150px] md:min-w-0"></div>
            ))
          ) : (
            featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price.amount}
                currency={product.price.currency}
                rating={product.rating}
                image={product.thumbnail}
                source={product.source}
                className="min-w-[200px] md:min-w-0"
              />
            ))
          )}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="w-full gradient-subtle py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {translatedValueProps.map((prop, index) => (
               <ValueProposition key={index} {...prop} />
             ))}
           </div>
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="container px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3">{translatedTitles.topSellers || "Top Sellers"}</h2>
          <p className="text-muted-foreground font-light">{translatedTitles.mostPopular || "Most popular products this week"}</p>
        </div>
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 overflow-x-auto gap-4 md:gap-6 md:overflow-visible pb-4 md:pb-0">
          {loadingTopSelling ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-muted aspect-square rounded-lg min-w-[150px] md:min-w-0"></div>
            ))
          ) : (
            topSellingProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price.amount}
                currency={product.price.currency}
                rating={product.rating}
                image={product.thumbnail}
                source={product.source}
                className="min-w-[200px] md:min-w-0"
              />
            ))
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-secondary/30 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3">{translatedTitles.customerSay || "What Our Customers Say"}</h2>
            <p className="text-muted-foreground font-light">{translatedTitles.trustedWorldwide || "Trusted by thousands worldwide"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
             {translatedTestimonials.map((testimonial, index) => (
               <TestimonialCard key={index} {...testimonial} />
             ))}
           </div>
        </div>
      </section>

      {/* General Products */}
      <section className="container px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-3">{translatedTitles.moreProducts || "More Products"}</h2>
          <p className="text-muted-foreground font-light">{translatedTitles.completeCollection || "Explore our complete collection"}</p>
        </div>
        {loadingGeneral && generalProducts.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-muted aspect-square rounded-lg"></div>
            ))}
          </div>
        ) : generalProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {generalProducts.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`}
                  id={product.id}
                  name={product.title}
                  price={product.price.amount}
                  currency={product.price.currency}
                  rating={product.rating}
                  image={product.thumbnail}
                  source={product.source}
                  product={product}
                />
              ))}
            </div>
            {hasMoreProducts && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => loadMoreProducts()}
                  disabled={loadingGeneral}
                  variant="outline"
                  size="lg"
                >
                  {loadingGeneral ? 'Loading...' : 'Load More Products'}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        )}
      </section>

      <Newsletter />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
