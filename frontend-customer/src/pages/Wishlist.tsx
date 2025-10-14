import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/contexts/CurrencyContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (product: any) => {
    try {
      setLoading(true);
      await addToCart({
        productId: product.id.toString(),
        name: product.title,
        price: product.price?.amount || product.price,
        image: product.thumbnail,
        source: product.source
      });
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen w-full pb-20 md:pb-0">
        <Header />
        <div className="container px-4 md:px-6 py-12 md:py-20">
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Start adding items you love to your wishlist. They'll be saved here for easy access.
            </p>
            <Button asChild size="lg">
              <a href="/">Start Shopping</a>
            </Button>
          </motion.div>
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
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-2">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="mt-4 md:mt-0 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative"
            >
              <ProductCard
                id={product.id}
                name={product.title}
                price={product.price.amount}
                currency={product.price.currency}
                rating={product.rating}
                image={product.thumbnail}
                source={product.source}
                product={product}
                className="h-full"
              />

              {/* Custom overlay buttons for wishlist page */}
              <div className="absolute bottom-2 left-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleAddToCart(product)}
                  disabled={loading}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleRemoveFromWishlist(product.id, product.title)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary */}
        <motion.div
          className="mt-12 p-6 bg-secondary/30 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Wishlist Summary</h3>
              <p className="text-muted-foreground">
                {wishlist.length} items • Total value: {formatPrice(
                  wishlist.reduce((total, product) => total + (product.price?.amount || 0), 0)
                )}
              </p>
            </div>
            <Button
              size="lg"
              className="mt-4 md:mt-0"
              onClick={() => {
                // Add all wishlist items to cart
                wishlist.forEach(product => handleAddToCart(product));
              }}
            >
              Add All to Cart
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Wishlist;