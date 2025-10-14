import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap, ShoppingCart, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { cachedApi, Product } from "@/lib/api";

const FlashSales = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Fetch flash sale products
  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const products = await cachedApi.getFlashSaleProducts(50);
        setFlashSaleProducts(products);
      } catch (error) {
        console.error('Error fetching flash sales:', error);
        // Fallback: try to get general products and filter
        try {
          const products = await cachedApi.getProducts(50);
          const flashSales = products.filter((product: Product) =>
            product.isFlashSale ||
            (product.discountPercentage && product.discountPercentage > 15)
          );
          setFlashSaleProducts(flashSales);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setFlashSaleProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSales();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchFlashSales, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const updateCountdowns = () => {
      const newTimeLeft: { [key: string]: string } = {};

      flashSaleProducts.forEach(product => {
        if (product.flashSaleEndTime) {
          const endTime = new Date(product.flashSaleEndTime).getTime();
          const now = new Date().getTime();
          const distance = endTime - now;

          if (distance > 0) {
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            newTimeLeft[product.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
            newTimeLeft[product.id] = 'EXPIRED';
          }
        }
      });

      setTimeLeft(newTimeLeft);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(interval);
  }, [flashSaleProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id.toString(),
      name: product.title,
      price: product.price.amount * (1 - (product.discountPercentage || 0) / 100),
      image: product.thumbnail,
      source: product.source
    });

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const formatPrice = (product: Product) => {
    const originalPrice = product.price.amount;
    const discountedPrice = product.discountPercentage
      ? originalPrice * (1 - product.discountPercentage / 100)
      : originalPrice;

    return {
      original: originalPrice,
      discounted: discountedPrice,
      savings: originalPrice - discountedPrice
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full pb-20 md:pb-0">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pb-20 md:pb-0">
      <Header />

      <div className="container px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Flash Sales
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Limited-time deals on premium products. Don't miss out!
          </p>
        </motion.div>

        {flashSaleProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Flash Sales Available</h2>
            <p className="text-muted-foreground mb-6">
              Check back later for amazing deals and limited-time offers.
            </p>
            <Button asChild>
              <a href="/">Continue Shopping</a>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {flashSaleProducts.map((product, index) => {
              const prices = formatPrice(product);
              const countdown = timeLeft[product.id] || '00:00:00';

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Flash Sale Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-600 hover:bg-red-700 text-white font-bold">
                            <Zap className="h-3 w-3 mr-1" />
                            {product.discountPercentage}% OFF
                          </Badge>
                        </div>

                        {/* Stock Indicator */}
                        {product.availability.stock < 10 && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="destructive" className="font-bold">
                              Only {product.availability.stock} left!
                            </Badge>
                          </div>
                        )}

                        {/* Countdown Timer */}
                        {countdown !== 'EXPIRED' && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
                              <Timer className="h-4 w-4 text-white" />
                              <span className="text-white font-mono text-sm font-bold">
                                {countdown}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviewCount || 0})
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${prices.discounted.toFixed(2)}
                          </span>
                          {prices.savings > 0 && (
                            <>
                              <span className="text-lg text-muted-foreground line-through">
                                ${prices.original.toFixed(2)}
                              </span>
                              <Badge variant="secondary" className="text-green-600">
                                Save ${prices.savings.toFixed(2)}
                              </Badge>
                            </>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                          disabled={product.availability.stock === 0 || countdown === 'EXPIRED'}
                        >
                          {product.availability.stock === 0 ? 'Out of Stock' :
                           countdown === 'EXPIRED' ? 'Sale Ended' :
                           'Add to Cart'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default FlashSales;