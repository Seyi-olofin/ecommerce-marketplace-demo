import { ArrowLeft, CreditCard, Truck, User, MapPin, LogIn, UserPlus, Loader2, AlertCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cachedApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useCountries, Country } from "@/hooks/useCountries";

const Checkout = () => {
  const { cart, refreshCart } = useCart();
  const { isAuthenticated, user } = useAuthContext();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    shippingMethod: 'standard',
    paymentMethod: 'card'
  });

  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const { countries, loading: countriesLoading, error: countriesError } = useCountries();

  console.log('Checkout - countries:', countries.length, 'loading:', countriesLoading, 'error:', countriesError);

  // Enhanced country selection handler
  const handleCountrySelect = (countryName: string) => {
    console.log('Checkout - selecting country:', countryName);
    setSelectedCountry(countryName);
    setCountryOpen(false);
  };

  // COUNTRY_BASED_TAX_LOGIC_HERE - Implement tax calculation based on selectedCountry
  // CURRENCY_DISPLAY_ADJUSTMENTS_HERE - Adjust currency display and formatting based on selectedCountry
  // PAYMENT_PROVIDER_MAPPING_HERE - Map payment methods to country-specific providers

  const subtotal = cart.reduce((sum, item) => {
    const price = (item as any).price || (item.product?.price?.amount || 0);
    return sum + (price * item.quantity);
  }, 0);
  const shipping = formData.shippingMethod === 'express' ? 15 : 5;
  const total = subtotal + shipping;

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
      setBillingAddress(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Update billing address when shipping address changes if using same address
  useEffect(() => {
    if (useShippingAsBilling) {
      setBillingAddress({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: selectedCountry
      });
    }
  }, [formData, selectedCountry, useShippingAsBilling]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handlePlaceOrder = async () => {
    console.log('Checkout - placing order, selectedCountry:', selectedCountry);

    if (!selectedCountry) {
      setOrderError('Please select your country');
      console.log('Checkout - no country selected');
      return;
    }

    // Enhanced payment method validation
    if (!formData.paymentMethod) {
      setOrderError('Please select a payment method');
      console.log('Checkout - no payment method selected');
      return;
    }

    console.log('Checkout - payment method selected:', formData.paymentMethod);
    console.log('Checkout - validating payment method');

    // Validate required fields - removed 'state' from required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      const errorMsg = `Please fill in all required fields: ${missingFields.join(', ')}`;
      setOrderError(errorMsg);
      console.log('Checkout - missing fields:', missingFields);
      return;
    }

    // Validate billing address if not using shipping address
    if (!useShippingAsBilling) {
      const billingRequiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode'];
      const missingBillingFields = billingRequiredFields.filter(field => !billingAddress[field as keyof typeof billingAddress]);

      if (missingBillingFields.length > 0) {
        const errorMsg = `Please fill in all billing address fields: ${missingBillingFields.join(', ')}`;
        setOrderError(errorMsg);
        console.log('Checkout - missing billing fields:', missingBillingFields);
        return;
      }
    }

    setIsCreatingOrder(true);
    setOrderError(null);

    try {
      console.log('Checkout - creating order with data:', {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: selectedCountry
        },
        billingAddress: useShippingAsBilling ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: selectedCountry
        } : billingAddress,
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        notes: `Shipping: ${formData.shippingMethod === 'express' ? 'Express' : 'Standard'}`
      });

      const orderData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: selectedCountry
        },
        billingAddress: useShippingAsBilling ? {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: selectedCountry
        } : billingAddress,
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        notes: `Shipping: ${formData.shippingMethod === 'express' ? 'Express' : 'Standard'}`
      };

      console.log('Checkout - calling cachedApi.createOrder');
      const order = await cachedApi.createOrder(orderData);
      console.log('Checkout - order created successfully:', order);

      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.orderNumber} has been created.`,
      });

      // Refresh cart to show it's empty
      await refreshCart();

      // Redirect to order confirmation
      navigate(`/order-confirmation/${order._id}`, { replace: true });

    } catch (error: any) {
      console.error('Checkout - order creation failed:', error);
      const errorMessage = error.message || 'Failed to create order. Please try again.';
      setOrderError(errorMessage);
      toast({
        title: "Order failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
          <Button variant="ghost" size="icon" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-semibold mb-2">No items to checkout</h2>
            <p className="text-muted-foreground mb-6">Add some products to your cart first</p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <div className="container px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
          <Button variant="ghost" size="icon" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">You must log in to continue your purchase</h2>
            <p className="text-muted-foreground mb-6">
              Already have an account? Log in to speed up checkout and view your order history.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link to={`/auth/login?redirect=/checkout`} className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/auth/signup?redirect=/checkout`} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="container px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
        {/* Back Button */}
        <Button variant="ghost" size="icon" className="mb-4" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8 px-4 md:px-0">
            <div className="flex items-center space-x-2 md:space-x-4 w-full max-w-md md:max-w-none">
              {[
                { step: 1, label: 'Shipping' },
                { step: 2, label: 'Payment' },
                { step: 3, label: 'Review' }
              ].map((item) => (
                <div key={item.step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    item.step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {item.step}
                  </div>
                  <span className={`ml-2 text-xs md:text-sm ${item.step <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                  {item.step < 3 && <div className={`w-8 md:w-12 h-0.5 ml-2 md:ml-4 ${item.step < currentStep ? 'bg-primary' : 'bg-muted'}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Details */}
              {currentStep === 1 && (
                <Card className="transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-left block font-medium">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="John"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-left block font-medium">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Doe"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-left block font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-left block font-medium">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-left block font-medium">Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 Main St, Apt 4B"
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-left block font-medium">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="New York"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-left block font-medium">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="NY (Optional)"
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-left block font-medium">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          placeholder="10001"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingMethod" className="text-left block font-medium">Shipping Method</Label>
                      <Select value={formData.shippingMethod} onValueChange={(value) => handleInputChange('shippingMethod', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Shipping ({formatPrice(5)})</SelectItem>
                          <SelectItem value="express">Express Shipping ({formatPrice(15)})</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment Method & Billing */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <Card className="transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Select Payment Method *</Label>
                          <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="credit_card">
                                <div className="flex items-center gap-2">
                                  💳 Credit/Debit Card
                                </div>
                              </SelectItem>
                              <SelectItem value="paypal">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/paypal.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="PayPal" className="w-4 h-4 object-contain" />
                                  PayPal
                                </div>
                              </SelectItem>
                              <SelectItem value="bank_transfer">
                                <div className="flex items-center gap-2">
                                  🏦 Bank Transfer
                                </div>
                              </SelectItem>
                              <SelectItem value="opay">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/opay.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Opay" className="w-4 h-4 object-contain" />
                                  Opay
                                </div>
                              </SelectItem>
                              <SelectItem value="uba">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/uba.ng?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="UBA" className="w-4 h-4 object-contain" />
                                  UBA Bank Transfer
                                </div>
                              </SelectItem>
                              <SelectItem value="gtbank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/gtbank.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="GTBank" className="w-4 h-4 object-contain" />
                                  GTBank
                                </div>
                              </SelectItem>
                              <SelectItem value="zenith_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/zenithbank.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Zenith Bank" className="w-4 h-4 object-contain" />
                                  Zenith Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="first_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/firstbanknigeria.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="First Bank" className="w-4 h-4 object-contain" />
                                  First Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="access_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/accessbankplc.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Access Bank" className="w-4 h-4 object-contain" />
                                  Access Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="fidelity_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/fidelitybank.ng?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Fidelity Bank" className="w-4 h-4 object-contain" />
                                  Fidelity Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="union_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/unionbankng.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Union Bank" className="w-4 h-4 object-contain" />
                                  Union Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="sterling_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/sterling.ng?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Sterling Bank" className="w-4 h-4 object-contain" />
                                  Sterling Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="wema_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/wemabank.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Wema Bank" className="w-4 h-4 object-contain" />
                                  Wema Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="ecobank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/ecobank.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Ecobank" className="w-4 h-4 object-contain" />
                                  Ecobank
                                </div>
                              </SelectItem>
                              <SelectItem value="stanbic_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/stanbicibtcbank.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Stanbic IBTC" className="w-4 h-4 object-contain" />
                                  Stanbic IBTC Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="polaris_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/polarisbanklimited.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Polaris Bank" className="w-4 h-4 object-contain" />
                                  Polaris Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="kuda_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/kuda.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Kuda Bank" className="w-4 h-4 object-contain" />
                                  Kuda Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="flutterwave">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/flutterwave.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Flutterwave" className="w-4 h-4 object-contain" />
                                  Flutterwave
                                </div>
                              </SelectItem>
                              <SelectItem value="paystack">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/paystack.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Paystack" className="w-4 h-4 object-contain" />
                                  Paystack
                                </div>
                              </SelectItem>
                              <SelectItem value="stripe">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/stripe.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Stripe" className="w-4 h-4 object-contain" />
                                  Stripe
                                </div>
                              </SelectItem>
                              <SelectItem value="apple_pay">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/apple.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Apple Pay" className="w-4 h-4 object-contain" />
                                  Apple Pay
                                </div>
                              </SelectItem>
                              <SelectItem value="google_pay">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/pay.google.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Google Pay" className="w-4 h-4 object-contain" />
                                  Google Pay
                                </div>
                              </SelectItem>

                              {/* American Banks */}
                              <SelectItem value="chase_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/chase.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Chase Bank" className="w-4 h-4 object-contain" />
                                  Chase Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="bank_of_america">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/bankofamerica.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Bank of America" className="w-4 h-4 object-contain" />
                                  Bank of America
                                </div>
                              </SelectItem>
                              <SelectItem value="wells_fargo">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/wellsfargo.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Wells Fargo" className="w-4 h-4 object-contain" />
                                  Wells Fargo
                                </div>
                              </SelectItem>
                              <SelectItem value="citibank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/citi.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Citibank" className="w-4 h-4 object-contain" />
                                  Citibank
                                </div>
                              </SelectItem>

                              {/* German Banks */}
                              <SelectItem value="deutsche_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/deutsche-bank.de?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Deutsche Bank" className="w-4 h-4 object-contain" />
                                  Deutsche Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="commerzbank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/commerzbank.de?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Commerzbank" className="w-4 h-4 object-contain" />
                                  Commerzbank
                                </div>
                              </SelectItem>
                              <SelectItem value="sparkasse">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/sparkasse.de?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Sparkasse" className="w-4 h-4 object-contain" />
                                  Sparkasse
                                </div>
                              </SelectItem>

                              {/* UK Banks */}
                              <SelectItem value="barclays">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/barclays.co.uk?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Barclays" className="w-4 h-4 object-contain" />
                                  Barclays
                                </div>
                              </SelectItem>
                              <SelectItem value="hsbc">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/hsbc.co.uk?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="HSBC" className="w-4 h-4 object-contain" />
                                  HSBC
                                </div>
                              </SelectItem>
                              <SelectItem value="lloyds_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/lloydsbankinggroup.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Lloyds Bank" className="w-4 h-4 object-contain" />
                                  Lloyds Bank
                                </div>
                              </SelectItem>

                              {/* Canadian Banks */}
                              <SelectItem value="royal_bank_canada">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/rbcroyalbank.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="RBC Royal Bank" className="w-4 h-4 object-contain" />
                                  RBC Royal Bank
                                </div>
                              </SelectItem>
                              <SelectItem value="td_bank">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/td.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="TD Bank" className="w-4 h-4 object-contain" />
                                  TD Bank
                                </div>
                              </SelectItem>

                              {/* Digital Wallets & Gift Cards */}
                              <SelectItem value="alipay">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/alipay.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Alipay" className="w-4 h-4 object-contain" />
                                  Alipay
                                </div>
                              </SelectItem>
                              <SelectItem value="wechat_pay">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/wechat.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="WeChat Pay" className="w-4 h-4 object-contain" />
                                  WeChat Pay
                                </div>
                              </SelectItem>
                              <SelectItem value="amazon_gift_card">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/amazon.com/gc?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Amazon Gift Card" className="w-4 h-4 object-contain" />
                                  Amazon Gift Card
                                </div>
                              </SelectItem>
                              <SelectItem value="steam_wallet">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/store.steampowered.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Steam Wallet" className="w-4 h-4 object-contain" />
                                  Steam Wallet
                                </div>
                              </SelectItem>

                              {/* Cryptocurrency */}
                              <SelectItem value="bitcoin">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/bitcoin.org?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Bitcoin" className="w-4 h-4 object-contain" />
                                  Bitcoin (BTC)
                                </div>
                              </SelectItem>
                              <SelectItem value="ethereum">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/ethereum.org?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Ethereum" className="w-4 h-4 object-contain" />
                                  Ethereum (ETH)
                                </div>
                              </SelectItem>
                              <SelectItem value="binance_pay">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/binance.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Binance Pay" className="w-4 h-4 object-contain" />
                                  Binance Pay
                                </div>
                              </SelectItem>
                              <SelectItem value="coinbase">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/coinbase.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Coinbase" className="w-4 h-4 object-contain" />
                                  Coinbase
                                </div>
                              </SelectItem>
                              <SelectItem value="crypto_com">
                                <div className="flex items-center gap-2">
                                  <img src="https://img.logo.dev/crypto.com?token=pk_BqNSfeKLS8Wh47hK1Xkl9g&size=20" alt="Crypto.com" className="w-4 h-4 object-contain" />
                                  Crypto.com
                                </div>
                              </SelectItem>
                              <SelectItem value="usdt">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-green-500 rounded text-white text-xs font-bold flex items-center justify-center">₮</div>
                                  Tether (USDT)
                                </div>
                              </SelectItem>
                              <SelectItem value="usdc">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">$</div>
                                  USD Coin (USDC)
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Country *</Label>
                          <Select
                            value={selectedCountry}
                            onValueChange={(value) => {
                              setSelectedCountry(value);
                              console.log('Checkout - country selected:', value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Africa */}
                              <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
                              <SelectItem value="South Africa">🇿🇦 South Africa</SelectItem>
                              <SelectItem value="Kenya">🇰🇪 Kenya</SelectItem>
                              <SelectItem value="Ghana">🇬🇭 Ghana</SelectItem>
                              <SelectItem value="Egypt">🇪🇬 Egypt</SelectItem>
                              <SelectItem value="Morocco">🇲🇦 Morocco</SelectItem>
                              <SelectItem value="Ethiopia">🇪🇹 Ethiopia</SelectItem>
                              <SelectItem value="Tanzania">🇹🇿 Tanzania</SelectItem>
                              <SelectItem value="Uganda">🇺🇬 Uganda</SelectItem>
                              <SelectItem value="Rwanda">🇷🇼 Rwanda</SelectItem>
                              <SelectItem value="Senegal">🇸🇳 Senegal</SelectItem>
                              <SelectItem value="Ivory Coast">🇨🇮 Ivory Coast</SelectItem>
                              <SelectItem value="Cameroon">🇨🇲 Cameroon</SelectItem>
                              <SelectItem value="Zimbabwe">🇿🇼 Zimbabwe</SelectItem>
                              <SelectItem value="Zambia">🇿🇲 Zambia</SelectItem>
                              <SelectItem value="Botswana">🇧🇼 Botswana</SelectItem>
                              <SelectItem value="Namibia">🇳🇦 Namibia</SelectItem>
                              <SelectItem value="Mozambique">🇲🇿 Mozambique</SelectItem>
                              <SelectItem value="Angola">🇦🇴 Angola</SelectItem>
                              <SelectItem value="Tunisia">🇹🇳 Tunisia</SelectItem>
                              <SelectItem value="Algeria">🇩🇿 Algeria</SelectItem>

                              {/* Europe */}
                              <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                              <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                              <SelectItem value="France">🇫🇷 France</SelectItem>
                              <SelectItem value="Italy">🇮🇹 Italy</SelectItem>
                              <SelectItem value="Spain">🇪🇸 Spain</SelectItem>
                              <SelectItem value="Netherlands">🇳🇱 Netherlands</SelectItem>
                              <SelectItem value="Belgium">🇧🇪 Belgium</SelectItem>
                              <SelectItem value="Austria">🇦🇹 Austria</SelectItem>
                              <SelectItem value="Switzerland">🇨🇭 Switzerland</SelectItem>
                              <SelectItem value="Sweden">🇸🇪 Sweden</SelectItem>
                              <SelectItem value="Norway">🇳🇴 Norway</SelectItem>
                              <SelectItem value="Denmark">🇩🇰 Denmark</SelectItem>
                              <SelectItem value="Finland">🇫🇮 Finland</SelectItem>
                              <SelectItem value="Ireland">🇮🇪 Ireland</SelectItem>
                              <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
                              <SelectItem value="Poland">🇵🇱 Poland</SelectItem>
                              <SelectItem value="Czech Republic">🇨🇿 Czech Republic</SelectItem>
                              <SelectItem value="Hungary">🇭🇺 Hungary</SelectItem>
                              <SelectItem value="Romania">🇷🇴 Romania</SelectItem>
                              <SelectItem value="Bulgaria">🇧🇬 Bulgaria</SelectItem>
                              <SelectItem value="Greece">🇬🇷 Greece</SelectItem>
                              <SelectItem value="Croatia">🇭🇷 Croatia</SelectItem>
                              <SelectItem value="Slovenia">🇸🇮 Slovenia</SelectItem>
                              <SelectItem value="Slovakia">🇸🇰 Slovakia</SelectItem>
                              <SelectItem value="Ukraine">🇺🇦 Ukraine</SelectItem>
                              <SelectItem value="Russia">🇷🇺 Russia</SelectItem>

                              {/* Americas */}
                              <SelectItem value="United States">🇺🇸 United States</SelectItem>
                              <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                              <SelectItem value="Brazil">🇧🇷 Brazil</SelectItem>
                              <SelectItem value="Mexico">🇲🇽 Mexico</SelectItem>
                              <SelectItem value="Argentina">🇦🇷 Argentina</SelectItem>
                              <SelectItem value="Colombia">🇨🇴 Colombia</SelectItem>
                              <SelectItem value="Chile">🇨🇱 Chile</SelectItem>
                              <SelectItem value="Peru">🇵🇪 Peru</SelectItem>
                              <SelectItem value="Venezuela">🇻🇪 Venezuela</SelectItem>
                              <SelectItem value="Ecuador">🇪🇨 Ecuador</SelectItem>
                              <SelectItem value="Uruguay">🇺🇾 Uruguay</SelectItem>
                              <SelectItem value="Paraguay">🇵🇾 Paraguay</SelectItem>
                              <SelectItem value="Bolivia">🇧🇴 Bolivia</SelectItem>

                              {/* Asia */}
                              <SelectItem value="China">🇨🇳 China</SelectItem>
                              <SelectItem value="India">🇮🇳 India</SelectItem>
                              <SelectItem value="Japan">🇯🇵 Japan</SelectItem>
                              <SelectItem value="South Korea">🇰🇷 South Korea</SelectItem>
                              <SelectItem value="Saudi Arabia">🇸🇦 Saudi Arabia</SelectItem>
                              <SelectItem value="UAE">🇦🇪 UAE</SelectItem>
                              <SelectItem value="Singapore">🇸🇬 Singapore</SelectItem>
                              <SelectItem value="Thailand">🇹🇭 Thailand</SelectItem>
                              <SelectItem value="Indonesia">🇮🇩 Indonesia</SelectItem>
                              <SelectItem value="Philippines">🇵🇭 Philippines</SelectItem>
                              <SelectItem value="Pakistan">🇵🇰 Pakistan</SelectItem>
                              <SelectItem value="Bangladesh">🇧🇩 Bangladesh</SelectItem>
                              <SelectItem value="Vietnam">🇻🇳 Vietnam</SelectItem>
                              <SelectItem value="Turkey">🇹🇷 Turkey</SelectItem>
                              <SelectItem value="Malaysia">🇲🇾 Malaysia</SelectItem>
                              <SelectItem value="Israel">🇮🇱 Israel</SelectItem>
                              <SelectItem value="Jordan">🇯🇴 Jordan</SelectItem>
                              <SelectItem value="Lebanon">🇱🇧 Lebanon</SelectItem>
                              <SelectItem value="Qatar">🇶🇦 Qatar</SelectItem>
                              <SelectItem value="Kuwait">🇰🇼 Kuwait</SelectItem>
                              <SelectItem value="Oman">🇴🇲 Oman</SelectItem>
                              <SelectItem value="Bahrain">🇧🇭 Bahrain</SelectItem>
                              <SelectItem value="Sri Lanka">🇱🇰 Sri Lanka</SelectItem>
                              <SelectItem value="Nepal">🇳🇵 Nepal</SelectItem>
                              <SelectItem value="Myanmar">🇲🇲 Myanmar</SelectItem>
                              <SelectItem value="Cambodia">🇰🇭 Cambodia</SelectItem>
                              <SelectItem value="Laos">🇱🇦 Laos</SelectItem>

                              {/* Oceania */}
                              <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                              <SelectItem value="New Zealand">🇳🇿 New Zealand</SelectItem>
                              <SelectItem value="Fiji">🇫🇯 Fiji</SelectItem>
                              <SelectItem value="Papua New Guinea">🇵🇬 Papua New Guinea</SelectItem>

                              {/* Caribbean */}
                              <SelectItem value="Jamaica">🇯🇲 Jamaica</SelectItem>
                              <SelectItem value="Trinidad and Tobago">🇹🇹 Trinidad and Tobago</SelectItem>
                              <SelectItem value="Barbados">🇧🇧 Barbados</SelectItem>
                              <SelectItem value="Bahamas">🇧🇸 Bahamas</SelectItem>

                              <SelectItem value="Other">🌍 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing Address */}
                  <Card className="transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Billing Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sameAddress"
                          checked={useShippingAsBilling}
                          onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="sameAddress" className="text-sm cursor-pointer">
                          Same as shipping address
                        </Label>
                      </div>

                      {!useShippingAsBilling && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="billingFirstName" className="text-left block font-medium">First Name *</Label>
                              <Input
                                id="billingFirstName"
                                value={billingAddress.firstName}
                                onChange={(e) => setBillingAddress(prev => ({ ...prev, firstName: e.target.value }))}
                                placeholder="John"
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingLastName" className="text-left block font-medium">Last Name *</Label>
                              <Input
                                id="billingLastName"
                                value={billingAddress.lastName}
                                onChange={(e) => setBillingAddress(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="Doe"
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billingEmail" className="text-left block font-medium">Email *</Label>
                            <Input
                              id="billingEmail"
                              type="email"
                              value={billingAddress.email}
                              onChange={(e) => setBillingAddress(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="john@example.com"
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billingPhone" className="text-left block font-medium">Phone</Label>
                            <Input
                              id="billingPhone"
                              value={billingAddress.phone}
                              onChange={(e) => setBillingAddress(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+1 (555) 123-4567"
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billingAddress" className="text-left block font-medium">Address *</Label>
                            <Textarea
                              id="billingAddress"
                              value={billingAddress.address}
                              onChange={(e) => setBillingAddress(prev => ({ ...prev, address: e.target.value }))}
                              placeholder="123 Main St, Apt 4B"
                              className="w-full"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="billingCity" className="text-left block font-medium">City *</Label>
                              <Input
                                id="billingCity"
                                value={billingAddress.city}
                                onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="New York"
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingState" className="text-left block font-medium">State</Label>
                              <Input
                                id="billingState"
                                value={billingAddress.state}
                                onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                                placeholder="NY (Optional)"
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingZipCode" className="text-left block font-medium">ZIP Code *</Label>
                              <Input
                                id="billingZipCode"
                                value={billingAddress.zipCode}
                                onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                                placeholder="10001"
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Order Review */}
                  <Card className="transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Review Your Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-6">
                        Please review your order details before confirming.
                      </p>

                      {orderError && (
                        <Alert className="mb-4" variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{orderError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Shipping Information */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Shipping Information
                          </h3>
                          <div className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            {formData.phone && <p><strong>Phone:</strong> {formData.phone}</p>}
                            <p><strong>Address:</strong> {formData.address}</p>
                            <p><strong>City:</strong> {formData.city}, {formData.state} {formData.zipCode}</p>
                            <p><strong>Country:</strong> {selectedCountry}</p>
                            <p><strong>Shipping Method:</strong> {formData.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping'}</p>
                          </div>
                        </div>

                        {/* Billing Information */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Billing & Payment
                          </h3>
                          <div className="space-y-2 text-sm">
                            {useShippingAsBilling ? (
                              <p><strong>Billing Address:</strong> Same as shipping</p>
                            ) : (
                              <>
                                <p><strong>Name:</strong> {billingAddress.firstName} {billingAddress.lastName}</p>
                                <p><strong>Email:</strong> {billingAddress.email}</p>
                                {billingAddress.phone && <p><strong>Phone:</strong> {billingAddress.phone}</p>}
                                <p><strong>Address:</strong> {billingAddress.address}</p>
                                <p><strong>City:</strong> {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}</p>
                                <p><strong>Country:</strong> {billingAddress.country}</p>
                              </>
                            )}
                            <p><strong>Payment Method:</strong> {
                              formData.paymentMethod === 'credit_card' ? 'Credit/Debit Card' :
                              formData.paymentMethod === 'paypal' ? 'PayPal' :
                              formData.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                              formData.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' :
                              'Not selected'
                            }</p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Summary */}
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                        <div className="space-y-3">
                          {cart.map((item) => {
                            const price = (item as any).price || (item.product?.price?.amount || 0);
                            const name = (item as any).name || item.product?.title || 'Unknown Product';

                            return (
                              <div key={item.id} className="flex justify-between items-center py-2">
                                <div className="flex-1">
                                  <p className="font-medium">{name}</p>
                                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">{formatPrice(price * item.quantity)}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                  Previous
                </Button>
                {currentStep < 3 ? (
                  <Button onClick={nextStep}>Next</Button>
                ) : (
                  <Button
                    size="lg"
                    className="px-8"
                    onClick={handlePlaceOrder}
                    disabled={isCreatingOrder}
                  >
                    {isCreatingOrder ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => {
                    const price = (item as any).price || (item.product?.price?.amount || 0);
                    const image = (item as any).image || item.product?.thumbnail || '/images/placeholder.jpg';
                    const name = (item as any).name || item.product?.title || 'Unknown Product';

                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={image || (item.product as any)?.image || '/images/placeholder.jpg'}
                            alt={name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-medium truncate">{name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold">{formatPrice(price * item.quantity)}</p>
                        </div>
                      </div>
                    );
                  })}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="text-right">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-right">{formatPrice(shipping)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-right">{formatPrice(total)}</span>
                    </div>
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

export default Checkout;