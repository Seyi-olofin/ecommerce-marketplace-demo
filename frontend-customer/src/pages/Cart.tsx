import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Link } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [clearingCart, setClearingCart] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const total = cart.reduce((sum, item) => {
    const price = (item as any).price || (item.product?.price?.amount || 0);
    return sum + (price * item.quantity);
  }, 0);

  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await clearCart();
      setShowClearDialog(false);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setClearingCart(false);
    }
  };

  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen w-full pb-20 md:pb-0">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <Button variant="ghost" size="icon" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-24 w-24 text-muted-foreground mb-4 animate-spin" />
            <h2 className="text-2xl font-semibold mb-2">Loading your cart...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your items</p>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen w-full pb-20 md:pb-0">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <Button variant="ghost" size="icon" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to get started</p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
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
        {/* Back Button */}
        <Button variant="ghost" size="icon" className="mb-4" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

          <div className="space-y-4 md:space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-card rounded-lg shadow-sm border overflow-hidden">
                <div className="flex gap-4 p-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={(item as any).image || item.product?.thumbnail || (item.product as any)?.image || '/images/placeholder.jpg'}
                      alt={(item as any).name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                      onError={(e) => {
                        // Fallback to a default image if the image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-medium mb-1 md:mb-2 line-clamp-2">{(item as any).name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">Unit Price: {formatPrice((item as any).price || (item.product?.price?.amount || 0))}</p>
                    <p className="text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4">{formatPrice(((item as any).price || (item.product?.price?.amount || 0)) * item.quantity)}</p>

                    {/* Mobile: Quantity and actions in a row */}
                    <div className="flex items-center justify-between gap-2 md:gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1 md:gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 md:h-9 md:w-9"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                        >
                          <Minus className="h-4 w-4 md:h-4 md:w-4" />
                        </Button>
                        <span className="w-11 md:w-10 text-center text-sm md:text-base font-medium flex items-center justify-center">
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 md:h-9 md:w-9"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                        >
                          <Plus className="h-4 w-4 md:h-4 md:w-4" />
                        </Button>
                      </div>

                      {/* Subtotal and Remove */}
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="text-base md:text-lg font-semibold text-right">
                          {formatPrice(((item as any).price || (item.product?.price?.amount || 0)) * item.quantity)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 md:h-9 md:w-9 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 md:h-4 md:w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 md:h-4 md:w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6 md:my-8" />

          {/* Cart Total */}
          <div className="bg-muted/50 rounded-lg p-4 md:p-6">
            <div className="flex justify-between items-center text-lg md:text-xl font-semibold mb-4">
              <span>Total:</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Clear Cart Button */}
              <Button
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
                onClick={() => setShowClearDialog(true)}
                disabled={loading || clearingCart || cart.length === 0}
              >
                Clear Cart
              </Button>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="flex-1 sm:flex-none sm:px-8"
                disabled={loading || cart.length === 0}
                asChild
              >
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Clear Shopping Cart
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You will lose all {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart.
            </AlertDescription>
          </Alert>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              disabled={clearingCart}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearCart}
              disabled={clearingCart}
            >
              {clearingCart ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Clearing...
                </>
              ) : (
                'Clear Cart'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Cart;