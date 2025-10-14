import { Star, ShoppingCart, Check, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { Product } from "@/lib/api";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ProductCardProps {
  id?: string | number;
  name: string;
  description?: string;
  price: number | { amount: number; currency: string };
  currency?: string;
  rating?: number;
  image?: string;
  discount?: number;
  className?: string;
  source?: string;
  product?: Product; // Full product object for more data
  showDescription?: boolean;
}

const ProductCard = memo(({ id, name, description, price, currency = "USD", rating = 4.5, image, discount, className, source, product, showDescription = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Update wishlist state when product changes
  useEffect(() => {
    if (product?.id) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product?.id, isInWishlist]);

  // Memoize price calculations
  const priceData = useMemo(() => {
    const priceAmount = typeof price === 'object' ? price.amount : price;
    const priceCurrency = typeof price === 'object' ? price.currency : currency;
    const actualDiscount = (product as any)?.discountPercentage || discount;
    const isFlashSale = (product as any)?.isFlashSale;
    const originalPrice = (product as any)?.price?.originalAmount || priceAmount;
    const finalPrice = actualDiscount ? priceAmount * (1 - actualDiscount / 100) : priceAmount;

    return {
      priceAmount,
      priceCurrency,
      actualDiscount,
      isFlashSale,
      originalPrice,
      finalPrice
    };
  }, [price, currency, product, discount]);

  // Memoize star ratings
  const starRatings = useMemo(() =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-accent text-accent" : "text-muted"}`}
      />
    )), [rating]
  );

  const handleCardClick = useCallback(() => {
    // Navigate to category/product URL if we have category info
    const categorySlug = product?.category ? normalizeCategory(product.category) : null;
    if (categorySlug) {
      navigate(`/category/${categorySlug}/product/${id}`);
    } else {
      navigate(`/product/${id}`);
    }
  }, [navigate, id, product]);

  // Helper function to normalize category names
  function normalizeCategory(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      toast({
        title: "Error",
        description: "Product ID is missing",
        variant: "destructive",
      });
      return;
    }
    try {
      await addToCart({
        productId: id.toString(),
        name,
        price: priceData.finalPrice,
        image,
        source
      });
      setIsAdded(true);
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  }, [addToCart, id, name, priceData.finalPrice, image, source, toast]);

  const handleBuyNow = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      toast({
        title: "Error",
        description: "Product ID is missing",
        variant: "destructive",
      });
      return;
    }
    try {
      await addToCart({
        productId: id.toString(),
        name,
        price: priceData.finalPrice,
        image,
        source
      });
      navigate('/checkout');
    } catch (error) {
      console.error('Buy now error:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  }, [addToCart, id, name, priceData.finalPrice, image, source, navigate, toast]);

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) {
      toast({
        title: "Error",
        description: "Product data is missing",
        variant: "destructive",
      });
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
      toast({
        title: "Removed from wishlist",
        description: `${name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
      toast({
        title: "Added to wishlist",
        description: `${name} has been added to your wishlist.`,
      });
    }
  }, [product, isWishlisted, addToWishlist, removeFromWishlist, name, toast]);

  return (
    <motion.div
      className={cn("group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ease-in-out overflow-hidden", className)}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-square">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback to a default image if the image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
            <div className="text-muted-foreground text-sm">No Image</div>
          </div>
        )}

        {(priceData.actualDiscount && priceData.actualDiscount > 0) && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Zap className="h-3 w-3" />
            -{priceData.actualDiscount}%
          </div>
        )}

        {priceData.isFlashSale && (
          <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Flash Sale
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:opacity-100 md:group-hover:opacity-100">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs md:hidden"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button
            variant={isAdded ? "default" : "secondary"}
            size="sm"
            className={`h-9 px-3 rounded-full ${isAdded ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white hover:bg-primary hover:text-white'} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1 md:hidden`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check className="h-3 w-3" />
                <span className="text-xs font-medium">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3" />
                <span className="text-xs font-medium">Add</span>
              </>
            )}
          </Button>
        </div>

        {/* Mobile Action Buttons - Always Visible */}
        <div className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button
            variant={isAdded ? "default" : "secondary"}
            size="sm"
            className={`flex-1 h-9 rounded-full ${isAdded ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white hover:bg-primary hover:text-white'} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-1`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check className="h-3 w-3" />
                <span className="text-xs font-medium">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3" />
                <span className="text-xs font-medium">Add to Cart</span>
              </>
            )}
          </Button>
        </div>

        {/* Wishlist Button */}
        <Button
          variant="outline"
          size="sm"
          className={`absolute top-3 left-3 z-10 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-0 ${isWishlisted ? 'text-red-500 border-red-500' : 'text-gray-600'}`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-sm md:text-base line-clamp-2 text-left">{name}</h3>

        {showDescription && description && (
          <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 text-left">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {starRatings}
          </div>
          <span className="text-xs text-muted-foreground">({rating})</span>
        </div>

        <div className="flex items-center gap-2">
          {priceData.actualDiscount && priceData.actualDiscount > 0 ? (
            <>
              <span className="text-lg font-bold text-green-600">{formatPrice(priceData.finalPrice)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(priceData.originalPrice)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">{formatPrice(priceData.priceAmount)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;
