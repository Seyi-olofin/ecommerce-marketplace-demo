import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useParams, Link, useNavigate } from "react-router-dom";

// Category image mapping - using real images from APIs
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
  'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center'
};

// Normalize category names to slugs
function normalizeCategory(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Get category image with fallback
function getCategoryImage(category) {
  const key = normalizeCategory(category);
  return categoryImages[key] || '/images/placeholder.jpg';
}
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchProductDetails, fetchProducts, Product } from "@/lib/api";
import { getProductImage } from "@/services/imageService";

const ProductDetail = () => {
    const { id, categorySlug, productId } = useParams();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
   const [product, setProduct] = useState<Product | null>(null);
   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [loadingRelated, setLoadingRelated] = useState(true);
   const scrollRef = useRef<HTMLDivElement>(null);
   const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
   const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
   const isMobile = useIsMobile();
 
     // Use productId if available (from category/product route), otherwise use id
     const productIdentifier = productId || id;

     // Debug logging
     console.log('ProductDetail - Route params:', { id, categorySlug, productId });
     console.log('ProductDetail - Using productIdentifier:', productIdentifier);
 
     // Helper function to get current image based on index
     const getCurrentImage = () => {
       const allImages = [
         ...((product as any).images || []),
         ...((product as any).gallery || []).slice(1),
         ...Array.from({ length: Math.max(0, 4 - ((product as any).images?.length || 1) - ((product as any).gallery?.length || 0)) }).map((_, i) =>
           `https://source.unsplash.com/random/400x400/?${encodeURIComponent(product.title)},product,${product.category || 'item'}`
         )
       ];
       return allImages[currentImageIndex] || product.thumbnail;
     };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productIdentifier) return;

      try {
        setLoading(true);
        console.log('Fetching product details for:', productIdentifier);

        // First try backend API
        let productData = null;
        try {
          productData = await fetchProductDetails(productIdentifier);
          console.log('Product loaded from API:', productData?.title);
        } catch (apiError) {
          console.log('API failed, trying local JSON fallback:', apiError);
        }

        // If API fails, try local JSON as fallback
        if (!productData) {
          try {
            console.log('API failed, trying local JSON fallback for product:', productIdentifier);
            const response = await fetch('/data/products.json');
            const allProducts = await response.json();
            console.log('Loaded products from JSON, total products:', allProducts.length);
            productData = allProducts.find((p: any) => p.id === productIdentifier);
            console.log('Product loaded from local JSON:', productData?.title, 'ID:', productData?.id);
            if (!productData) {
              console.log('Product not found in local JSON. Available IDs:', allProducts.slice(0, 10).map(p => p.id));
            }

            // Product data already has correct local image paths from products.json
            // No need to enhance with external images since local images are working
          } catch (jsonError) {
            console.error('Error fetching from local JSON:', jsonError);
          }
        }

        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productIdentifier]);

  useEffect(() => {
     const fetchRelatedProducts = async () => {
        if (!product) return;

        try {
          setLoadingRelated(true);
          // Use local JSON as single source for related products
          const response = await fetch('/data/products.json');
          const allProducts = await response.json();

          // Get more variety - take from same category first, then add from other categories
          let related = allProducts
            .filter(p => p.category === (product as any).category && p.id !== product.id)
            .slice(0, 4); // Take up to 4 from same category

          // Add more variety from other categories to reach 8-10 products
          if (related.length < 8) {
            const remaining = allProducts
              .filter(p => p.id !== product.id && !related.some(r => r.id === p.id))
              .slice(0, 8 - related.length);
            related.push(...remaining);
          }

          // Use local images for related products (consistent with main product)
          const enhancedRelated = related.map((p: any) => ({
            ...p,
            price: { amount: p.price.amount, currency: p.price.currency },
            thumbnail: p.thumbnail // Use local image paths from products.json
          }));

          setRelatedProducts(enhancedRelated);
        } catch (error) {
          console.error('Error fetching related products:', error);
        } finally {
          setLoadingRelated(false);
        }
      };

      fetchRelatedProducts();
    }, [product]);

  // Update wishlist state when product changes
  useEffect(() => {
    if (product?.id) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product?.id, isInWishlist]);

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart({
        productId: product.id.toString(),
        name: product.title,
        price: product.price.amount,
        image: product.thumbnail,
        source: product.source
      });
      navigate('/checkout');
    } catch (error) {
      console.error('Buy now error:', error);
      // Error handling is done in the CartContext
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12 text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/">Back to Shop</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      
      <div className="container px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            {categorySlug && (
              <>
                <Link to={`/category/${categorySlug}`} className="hover:text-primary transition-colors capitalize">
                  {categorySlug.replace('-', ' ')}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground font-medium truncate">{product?.title}</span>
          </nav>
        </div>

        {/* Back Button */}
        <Button variant="ghost" size="icon" className="mb-4" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-muted aspect-square shadow-lg cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <img
                src={getCurrentImage()}
                alt={`${product.title} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a default image if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
              {/* Loading overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Click to enlarge</span>
              </div>
              {/* Wishlist Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!product) return;
                  if (isWishlisted) {
                    removeFromWishlist(product.id);
                    setIsWishlisted(false);
                  } else {
                    addToWishlist(product);
                    setIsWishlisted(true);
                  }
                }}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {/* Main product images */}
              {((product as any).images && (product as any).images.length > 0 ? (product as any).images : [product.thumbnail]).map((img: string, i: number) => (
                <div key={i} className={`relative overflow-hidden rounded-lg bg-muted aspect-square border-2 cursor-pointer transition-all duration-300 ${i === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-primary'}`} onClick={() => setCurrentImageIndex(i)}>
                  <img
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a default image if the image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
              ))}

              {/* Additional Product Images from gallery array */}
              {((product as any).gallery || []).slice(1).map((img: string, i: number) => {
                const galleryIndex = ((product as any).images?.length || 1) + i;
                return (
                  <div key={`gallery-${i}`} className={`relative overflow-hidden rounded-lg bg-muted aspect-square border-2 cursor-pointer transition-all duration-300 ${galleryIndex === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-primary'}`} onClick={() => setCurrentImageIndex(galleryIndex)}>
                    <img
                      src={img}
                      alt={`${product.title} gallery ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a default image if the image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                );
              })}

              {/* Generate additional images if needed to fill gallery */}
              {Array.from({ length: Math.max(0, 4 - ((product as any).images?.length || 1) - ((product as any).gallery?.length || 0)) }).map((_, i) => {
                const additionalIndex = ((product as any).images?.length || 1) + ((product as any).gallery?.length || 0) + i;
                return (
                  <div key={`additional-${i}`} className={`relative overflow-hidden rounded-lg bg-muted aspect-square border-2 cursor-pointer transition-all duration-300 ${additionalIndex === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-primary'}`} onClick={() => setCurrentImageIndex(additionalIndex)}>
                    <img
                      src={`https://source.unsplash.com/random/400x400/?${encodeURIComponent(product.title)},product,${product.category || 'item'}`}
                      alt={`${product.title} ${additionalIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a default image if the image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5) ? "fill-accent text-accent" : "text-muted"}`}
                  />
                ))}
                <span className="ml-1">{product.rating || 4.5}</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <span className={`text-sm font-medium ${(product as any).availability?.status === 'in_stock' ? 'text-green-600' : 'text-red-600'}`}>
                {(product as any).availability?.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
              </span>
              {(product as any).availability?.stock ? (
                <span className="text-sm text-muted-foreground ml-2">
                  ({(product as any).availability.stock} available)
                </span>
              ) : (
                <span className="text-sm text-muted-foreground ml-2">
                  (10 available)
                </span>
              )}
            </div>

            {/* Price */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">${((product as any).price?.amount || 0).toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  <span>30 Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 rounded-lg shadow-lg">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                {product.title}
              </h1>

              {/* Category */}
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">
                  Category: <Link to={`/category/${normalizeCategory((product as any).category || 'general')}`} className="hover:text-primary transition-colors capitalize">
                    {(product as any).category?.replace('-', ' ') || 'General'}
                  </Link>
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description || (product as any).description || 'Description not available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <div className="space-y-6">
            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure Payment</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
              </div>
            </div>

            {/* Buttons and Icons Side by Side */}
            <div className="hidden md:flex gap-4 items-center flex-wrap">
              <Button size="lg" className="flex-1 h-14 text-lg bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" onClick={async () => {
                try {
                  await addToCart({
                    productId: product.id.toString(),
                    name: product.title,
                    price: product.price.amount,
                    image: product.thumbnail,
                    source: product.source
                  });
                } catch (error) {
                  console.error('Add to cart error:', error);
                }
              }}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-6 border-2 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`gap-2 ${isWishlisted ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''}`}
                onClick={() => {
                  if (isWishlisted) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.title,
                    text: product.description,
                    url: window.location.href,
                  });
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(window.location.href);
                  // Could show a toast here
                }
              }}>
                <Share2 className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>

          <div>
            {/* Specifications */}
            {(product as any).specifications && Object.keys((product as any).specifications).length > 0 ? (
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">Specifications</h2>
                <div className="grid gap-4">
                  {Object.entries((product as any).specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">{key}</span>
                      <span className="text-sm text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">Product Details</h2>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Detailed specifications not available for this product.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sticky Footer */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex gap-2 z-50">
            <Button size="sm" className="flex-1 h-12 text-base bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300" onClick={async () => {
              try {
                await addToCart({
                  productId: product.id.toString(),
                  name: product.title,
                  price: product.price.amount,
                  image: product.thumbnail,
                  source: product.source
                });
              } catch (error) {
                console.error('Add to cart error:', error);
              }
            }}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-12 px-4 border-2 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        )}


        {/* Related Products */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold">You May Also Like</h2>
            <Button variant="outline" asChild>
              <Link to="/">View More Products</Link>
            </Button>
          </div>
          {loadingRelated ? (
            <div className="flex gap-4 overflow-x-auto scroll-smooth pb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-64">
                  <div className="animate-pulse bg-muted aspect-square rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-4">
                {relatedProducts.map((relatedProduct, index) => (
                  <div key={relatedProduct.id} className="flex-shrink-0 w-64">
                    <ProductCard
                      id={relatedProduct.id}
                      name={relatedProduct.title}
                      price={relatedProduct.price.amount}
                      currency={relatedProduct.price.currency}
                      rating={relatedProduct.rating}
                      image={relatedProduct.thumbnail}
                      source={relatedProduct.source}
                    />
                  </div>
                ))}
              </div>
              {relatedProducts.length > 3 && (
                <>
                  <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg" onClick={scrollLeft}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg" onClick={scrollRight}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl w-full h-full max-h-[95vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={getCurrentImage()}
              alt={`${product.title} ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                // Fallback to a default image if the image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
            />

            {/* Product Details Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl font-bold text-green-400">${((product as any).price?.amount || 0).toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                      />
                    ))}
                    <span className="ml-1 text-sm">{product.rating || 4.5}</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-2"><strong>Brand:</strong> {(product as any).brand || 'Premium Brand'}</p>
                    <p className="mb-2"><strong>Category:</strong> {(product as any).category?.replace('-', ' ') || 'General'}</p>
                    <p className="mb-2"><strong>Source:</strong> {(product as any).source || 'Local'}</p>
                  </div>
                  <div>
                    <p className="mb-2"><strong>Availability:</strong> {(product as any).availability?.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}</p>
                    <p className="mb-2"><strong>Stock:</strong> {(product as any).availability?.stock || 10} units</p>
                    <p className="mb-2"><strong>Warranty:</strong> {(product as any).details?.warranty || '2-year limited warranty'}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <p className="text-sm leading-relaxed opacity-90">{product.description}</p>
                </div>

                {/* Features */}
                {(product as any).details?.features && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Key Features:</h3>
                    <ul className="text-sm space-y-1">
                      {(product as any).details.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Shipping Info */}
                {(product as any).details?.shipping && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">🚚</span>
                        <div>
                          <p className="font-medium">Free Shipping</p>
                          <p className="text-xs opacity-75">{(product as any).details.shipping.estimatedDelivery}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">↩️</span>
                        <div>
                          <p className="font-medium">Easy Returns</p>
                          <p className="text-xs opacity-75">{(product as any).details.shipping.returnPolicy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">🛡️</span>
                        <div>
                          <p className="font-medium">Secure Payment</p>
                          <p className="text-xs opacity-75">Multiple payment options</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Prev Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 text-white"
              onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : ((product as any).images?.length || 1) - 1))}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 text-white"
              onClick={() => setCurrentImageIndex((prev) => (prev < (((product as any).images?.length || 1) - 1) ? prev + 1 : 0))}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-white"
              onClick={() => setLightboxOpen(false)}
            >
              ×
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
