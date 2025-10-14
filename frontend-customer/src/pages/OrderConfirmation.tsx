import { CheckCircle, ArrowLeft, Package, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cachedApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  items: Array<{
    productId: string;
    title: string;
    price: { amount: number; currency: string };
    quantity: number;
    totalPrice: { amount: number; currency: string };
    image?: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    method: string;
    status: string;
  };
  subtotal: { amount: number; currency: string };
  taxAmount: { amount: number; currency: string };
  shippingCost: { amount: number; currency: string };
  totalAmount: { amount: number; currency: string };
  createdAt: string;
  notes?: string;
}

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        const orderData = await cachedApi.getOrder(id);
        setOrder(orderData);
      } catch (err: any) {
        console.error('Failed to fetch order:', err);
        setError(err.message || 'Failed to load order details');
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Loading order details...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12">
          <Button variant="ghost" size="icon" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The order you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="container px-4 md:px-6 py-8 md:py-12">
        {/* Back Button */}
        <Button variant="ghost" size="icon" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-semibold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-green-800">
                <strong>Order #{order.orderNumber}</strong> - Status: <span className="capitalize">{order.status}</span>
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order #{order.orderNumber}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Order Date</span>
                    <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="text-sm capitalize">{order.status}</span>
                  </div>

                  <Separator />

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          <p className="text-sm font-semibold">{formatPrice(item.totalPrice.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-base">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.email}
                      </p>
                      {order.shippingAddress.phone && (
                        <p className="text-sm text-muted-foreground">
                          {order.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium mb-1">Shipping Address:</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information */}
              {order.billingAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-base">
                          {order.billingAddress.firstName} {order.billingAddress.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.billingAddress.email}
                        </p>
                        {order.billingAddress.phone && (
                          <p className="text-sm text-muted-foreground">
                            {order.billingAddress.phone}
                          </p>
                        )}
                      </div>
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-1">Billing Address:</p>
                        <p className="text-sm text-muted-foreground">
                          {order.billingAddress.address}<br />
                          {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}<br />
                          {order.billingAddress.country}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Payment Method</span>
                      <span className="text-sm font-medium capitalize">
                        {order.payment.method === 'credit_card' ? 'Credit/Debit Card' :
                         order.payment.method === 'paypal' ? 'PayPal' :
                         order.payment.method === 'bank_transfer' ? 'Bank Transfer' :
                         order.payment.method === 'opay' ? 'Opay' :
                         order.payment.method === 'uba' ? 'UBA Bank Transfer' :
                         order.payment.method === 'gtbank' ? 'GTBank' :
                         order.payment.method === 'zenith_bank' ? 'Zenith Bank' :
                         order.payment.method === 'first_bank' ? 'First Bank' :
                         order.payment.method === 'access_bank' ? 'Access Bank' :
                         order.payment.method === 'fidelity_bank' ? 'Fidelity Bank' :
                         order.payment.method === 'union_bank' ? 'Union Bank' :
                         order.payment.method === 'sterling_bank' ? 'Sterling Bank' :
                         order.payment.method === 'wema_bank' ? 'Wema Bank' :
                         order.payment.method === 'ecobank' ? 'Ecobank' :
                         order.payment.method === 'stanbic_bank' ? 'Stanbic IBTC Bank' :
                         order.payment.method === 'polaris_bank' ? 'Polaris Bank' :
                         order.payment.method === 'kuda_bank' ? 'Kuda Bank' :
                         order.payment.method === 'flutterwave' ? 'Flutterwave' :
                         order.payment.method === 'paystack' ? 'Paystack' :
                         order.payment.method === 'stripe' ? 'Stripe' :
                         order.payment.method === 'apple_pay' ? 'Apple Pay' :
                         order.payment.method === 'google_pay' ? 'Google Pay' :
                         order.payment.method}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Payment Status</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
                        order.payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.payment.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.payment.status}
                      </span>
                    </div>
                    {order.notes && (
                      <div className="border-t pt-3 mt-3">
                        <span className="text-sm text-muted-foreground">Order Notes:</span>
                        <p className="text-sm mt-1">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Total */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Total</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatPrice(order.shippingCost.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatPrice(order.taxAmount.amount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(order.totalAmount.amount)}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• You'll receive an email confirmation shortly</li>
                        <li>• Your order status will be updated as it progresses</li>
                        <li>• Track your order in your profile dashboard</li>
                        <li>• Contact us if you have any questions</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/account/profile">View Order History</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/">Continue Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;