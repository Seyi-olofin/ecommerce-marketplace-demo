import { ArrowLeft, Filter, Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ProductCard from "@/components/ProductCard";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { cachedApi, Product, Category } from "@/lib/api";
import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";
import { useCurrency } from "@/contexts/CurrencyContext";

// Category configurations with real data
const categoryConfigs = {
  'electronics': {
    title: 'Electronics',
    description: 'Discover the latest in cutting-edge technology and innovative gadgets',
    heroImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
    features: ['Latest Technology', 'Premium Brands', 'Warranty Included', 'Fast Shipping'],
    color: 'from-blue-500 to-purple-600'
  },
  'laptops': {
    title: 'Laptops & Computers',
    description: 'Find the perfect laptop for work, gaming, or creative projects',
    heroImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=400&fit=crop',
    features: ['High Performance', 'Long Battery Life', 'Premium Displays', 'Powerful Processors'],
    color: 'from-gray-600 to-gray-800'
  }
};

// Get category configuration
function getCategoryConfig(categorySlug) {
  return categoryConfigs[categorySlug] || {
    title: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', ' '),
    description: `Explore our ${categorySlug.replace('-', ' ')} collection`,
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    features: ['Quality Products', 'Best Prices', 'Fast Delivery'],
    color: 'from-primary to-primary/80'
  };
}

const CategoryPage = () => {
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const { t, isTranslating } = useI18n();
    const { formatPrice, convertPrice } = useCurrency();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<string>('featured');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    // Normalize category slug for consistent matching
    const normalizedCategory = categorySlug?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    console.log('CategoryPage - received categorySlug:', categorySlug, 'normalized:', normalizedCategory);
    const categoryConfig = getCategoryConfig(normalizedCategory || '');
    const category = normalizedCategory; // Define category variable

   useEffect(() => {
      const fetchData = async () => {
        if (!category) return;

        try {
          setLoading(true);

          // Fetch products for the category - use backend API as single source
          let data: Product[] = [];
          try {
            console.log('Fetching products for category:', category);
            const response = await cachedApi.getProducts(`category=${category}&limit=50`);
            data = Array.isArray(response) ? response : (response as any).products || [];
            console.log('Products loaded from API for category:', data.length);
          } catch (error) {
            console.error('Failed to load products from API:', error);
            data = [];
          }

          setProducts(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [category]);

  // Filter and sort products
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const productCategory = (product as any).category?.toString().toLowerCase();
    const currentCategorySlug = normalizedCategory;
    console.log('CategoryPage - filtering product:', (product as any).title, 'category:', productCategory, 'vs slug:', currentCategorySlug);
    return productCategory === currentCategorySlug ||
           productCategory?.includes(currentCategorySlug) ||
           productCategory?.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === currentCategorySlug;
  }) : [];
  console.log('CategoryPage - filtered products:', filteredProducts.length, 'from total:', products.length);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price.amount - b.price.amount;
      case 'price-high':
        return b.price.amount - a.price.amount;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime();
      default:
        return 0;
    }
  });

  // Filter by price range
  const priceFilteredProducts = sortedProducts.filter(product =>
    product.price.amount >= priceRange[0] && product.price.amount <= priceRange[1]
  );

  // Filter by brands
  const finalProducts = selectedBrands.length > 0
    ? priceFilteredProducts.filter(product => selectedBrands.includes((product as any).brand || ''))
    : priceFilteredProducts;

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        productId: product.id.toString(),
        name: product.title,
        price: product.price.amount,
        image: product.thumbnail,
        source: product.source
      });
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full pb-20 md:pb-0">
      <Header />

      {/* Hero Section */}
      <motion.div
        className={`relative h-64 md:h-80 bg-gradient-to-r ${categoryConfig.color} overflow-hidden`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${categoryConfig.heroImage})` }}
        ></div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{categoryConfig.title}</h1>
            <p className="text-xl md:text-2xl opacity-90">{categoryConfig.description}</p>
          </div>
        </div>
      </motion.div>

      <div className="container px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">{categoryConfig.title}</span>
          </nav>
        </div>

        {/* Back Button */}
        <Button variant="ghost" size="icon" className="mb-4" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Category Features */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categoryConfig.features.map((feature, index) => (
            <Card key={index} className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-sm font-medium text-primary">{feature}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Price Range:</span>
            <input
              type="range"
              min="0"
              max="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            {finalProducts.length} products found
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : finalProducts.length > 0 ? (
            finalProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={(product as any).image || product.thumbnail || (product as any).images?.[0] || '/images/placeholder.jpg'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onLoad={() => console.log('✅ Image loaded:', product.title)}
                        onError={(e) => {
                          console.log('❌ Image failed to load:', product.title, (e.target as HTMLImageElement).src);
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button size="icon" variant="secondary" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      {(product as any).isFlashSale && (
                        <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({product.rating?.toFixed(1) || '0.0'})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">
                            ${formatPrice(product.price.amount)}
                          </span>
                          {(product as any).originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${(product as any).originalPrice}
                            </span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="gap-1"
                        >
                          <ShoppingCart className="h-3 w-3" />
                          Add
                        </Button>
                      </div>

                      {(product as any).brand && (
                        <div className="text-xs text-muted-foreground mt-2">
                          by {(product as any).brand}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any products matching your criteria.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}
        </motion.div>

        {/* Load More Button */}
        {!loading && finalProducts.length > 0 && finalProducts.length >= 12 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg" className="gap-2">
              <span>Load More Products</span>
            </Button>
          </div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default CategoryPage;