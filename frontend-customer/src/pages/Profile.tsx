import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Settings,
  ShoppingBag,
  Globe,
  DollarSign,
  LogOut,
  Package,
  Calendar,
  CreditCard,
  Edit,
  MapPin,
  Bell,
  Shield,
  Save,
  Plus,
  Trash2
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cachedApi, Order } from "@/lib/api";
import { useCountries } from "@/hooks/useCountries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Profile API functions
const updateProfile = async (userId: string, profileData: any) => {
  const response = await fetch(`/api/users/${userId}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
};

const getUserProfile = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}/profile`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 129.99,
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 79.99 },
      { name: "Phone Case", quantity: 1, price: 29.99 },
      { name: "Screen Protector", quantity: 1, price: 20.01 },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "Shipped",
    total: 89.50,
    items: [
      { name: "Smart Watch", quantity: 1, price: 89.50 },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "Processing",
    total: 45.00,
    items: [
      { name: "USB Cable", quantity: 2, price: 22.50 },
    ],
  },
];

const Profile = () => {
  const { user, logout } = useAuthContext();
  const { language, setLanguage, t } = useI18n();
  const { currency, setCurrency, formatPrice } = useCurrency();

  // Translation state
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  // Early return if user is not available
  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: (user as any).phone || '',
    bio: (user as any).bio || '',
    dateOfBirth: (user as any).dateOfBirth || '',
    gender: (user as any).gender || ''
  });

  // Update profileData when user changes
  useEffect(() => {
    setProfileData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: (user as any).phone || '',
      bio: (user as any).bio || '',
      dateOfBirth: (user as any).dateOfBirth || '',
      gender: (user as any).gender || ''
    });
  }, [user]);

  // Load user profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        console.log('Profile - loading profile for user:', user.id);
        const profile = await getUserProfile(user.id);
        console.log('Profile - loaded profile data:', profile);

        setProfileData({
          firstName: profile.firstName || user.firstName || '',
          lastName: profile.lastName || user.lastName || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          dateOfBirth: profile.dateOfBirth || '',
          gender: profile.gender || ''
        });
      } catch (error) {
        console.error('Profile - failed to load profile:', error);
        // Fallback to user data
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: (user as any).phone || '',
          bio: (user as any).bio || '',
          dateOfBirth: (user as any).dateOfBirth || '',
          gender: (user as any).gender || ''
        });
      }
    };

    loadProfile();
  }, [user]);

  // Address management state
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      name: `${user.firstName || 'John'} ${user.lastName || 'Doe'}`,
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true
    }
  ]);

  // Country selection state
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const { countries, loading: countriesLoading, error: countriesError } = useCountries();

  console.log('Profile - countries:', countries.length, 'loading:', countriesLoading, 'error:', countriesError);

  // Debug country dropdown
  const handleCountrySelect = (countryName: string) => {
    console.log('Profile - country selected:', countryName);
    setSelectedCountry(countryName);
  };

  // Enhanced country dropdown with proper state management
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: false,
    twoFactorAuth: false
  });

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoadingTranslations(true);
        const [welcomeText, logoutText] = await Promise.all([
          t('welcome'),
          t('logout')
        ]);
        setTranslations({
          welcome: welcomeText,
          logout: logoutText
        });
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English
        setTranslations({
          welcome: 'Welcome',
          logout: 'Logout'
        });
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [language, t]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;

      try {
        setLoadingOrders(true);
        const userOrders = await cachedApi.getOrders();
        // Transform backend order format to frontend format
        const transformedOrders = userOrders.map((order: any) => ({
          id: order.orderNumber || order._id,
          items: order.items || [],
          total: order.totalAmount?.amount || order.total || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || new Date().toISOString()
        }));
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Profile editing handlers
  const handleProfileUpdate = async () => {
    if (!user?.id) return;

    try {
      setLoadingProfile(true);
      console.log('Profile - updating profile with data:', profileData);

      // Update profile via API
      const updatedProfile = await updateProfile(user.id, profileData);
      console.log('Profile - API response:', updatedProfile);

      // Update the user context with new data
      const updatedUser = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender
      };

      // Update localStorage
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));

      setIsEditingProfile(false);
      console.log('Profile - updated successfully');

      // Show success message
      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Profile - failed to update:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoadingProfile(false);
    }
  };

  // Address management handlers
  const handleAddAddress = () => {
    const address = {
      ...newAddress,
      id: Date.now().toString(),
      isDefault: false
    };
    setAddresses([...addresses, address]);
    setNewAddress({
      type: 'Home',
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    });
    setShowAddAddress(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  // Settings handlers
  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  // Early return moved to top of component

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="container px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Profile Header */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-secondary/5 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-20 w-20 md:h-24 md:w-24">
                <AvatarImage src={(user as any).avatar} alt={user.firstName} loading="lazy" />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">
                    {translations.welcome || 'Welcome'}, {user.firstName || 'User'}!
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base">{user.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 mt-3">
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Globe className="h-3 w-3" />
                      {language.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <DollarSign className="h-3 w-3" />
                      {currency}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <User className="h-3 w-3" />
                      Member since {new Date().getFullYear()}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0"
                >
                  <LogOut className="h-4 w-4" />
                  {translations.logout || 'Logout'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditingProfile ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-2">
                        <Button onClick={handleProfileUpdate} disabled={loadingProfile}>
                          <Save className="h-4 w-4 mr-2" />
                          {loadingProfile ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                        <p className="text-lg">{user.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                        <p className="text-lg">{user.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="text-lg">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                        <p className="text-lg">{profileData.phone || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                        <p className="text-lg">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                        <p className="text-lg text-green-600 font-medium">Active</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address Book
                    </CardTitle>
                    <Button
                      onClick={() => setShowAddAddress(true)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showAddAddress && (
                    <Card className="border-dashed">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Address Type</Label>
                            <Select value={newAddress.type} onValueChange={(value) => setNewAddress(prev => ({ ...prev, type: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Home">Home</SelectItem>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                              value={newAddress.name}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label>Street Address</Label>
                            <Textarea
                              value={newAddress.street}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                              placeholder="123 Main Street, Apt 4B"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                              value={newAddress.city}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>State/Province</Label>
                            <Input
                              value={newAddress.state}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ZIP/Postal Code</Label>
                            <Input
                              value={newAddress.zipCode}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Country</Label>
                            {countriesLoading ? (
                              <Input disabled placeholder="Loading countries..." />
                            ) : countriesError ? (
                              <Input
                                value={newAddress.country}
                                onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                                placeholder="Enter country manually"
                              />
                            ) : countries.length === 0 ? (
                              <Input
                                value={newAddress.country}
                                onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                                placeholder="No countries loaded"
                              />
                            ) : (
                              <Select
                                value={newAddress.country}
                                onValueChange={(value) => {
                                  console.log('Profile - country selected:', value);
                                  setNewAddress(prev => ({ ...prev, country: value }));
                                }}
                                open={countryDropdownOpen}
                                onOpenChange={setCountryDropdownOpen}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((country) => {
                                    console.log('Profile - rendering country:', country.name.common);
                                    return (
                                      <SelectItem
                                        key={country.cca2}
                                        value={country.name.common}
                                      >
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={country.flags.png}
                                            alt={`${country.name.common} flag`}
                                            className="w-4 h-3 object-cover rounded-sm"
                                            onError={(e) => {
                                              console.log('Profile - flag failed for:', country.name.common);
                                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/16x12?text=🏳️';
                                            }}
                                          />
                                          {country.name.common}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                          <div className="md:col-span-2 flex gap-2">
                            <Button onClick={handleAddAddress}>
                              <Save className="h-4 w-4 mr-2" />
                              Save Address
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddAddress(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{address.type}</Badge>
                                {address.isDefault && <Badge className="bg-primary">Default</Badge>}
                              </div>
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.street}<br />
                                {address.city}, {address.state} {address.zipCode}<br />
                                {address.country}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!address.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <Skeleton className="h-12 w-12 rounded" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Package className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Order {order.id}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{(item as any).name || (item.product as any)?.title || 'Product'} × {item.quantity}</span>
                                <span>{formatPrice(((item as any).price || (item.product as any)?.price?.amount || 0) * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-3" />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CreditCard className="h-4 w-4" />
                              Total: {formatPrice(order.total)}
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Language
                      </label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Currency
                      </label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="NGN">NGN (₦)</SelectItem>
                          <SelectItem value="KES">KES (KSh)</SelectItem>
                          <SelectItem value="ZAR">ZAR (R)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive order updates via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Order Updates</Label>
                        <p className="text-xs text-muted-foreground">Get notified about order status changes</p>
                      </div>
                      <Switch
                        checked={settings.orderUpdates}
                        onCheckedChange={(checked) => handleSettingChange('orderUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Promotional Emails</Label>
                        <p className="text-xs text-muted-foreground">Receive deals and special offers</p>
                      </div>
                      <Switch
                        checked={settings.promotionalEmails}
                        onCheckedChange={(checked) => handleSettingChange('promotionalEmails', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">SMS Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive text messages for important updates</p>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Security */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Change Password</Label>
                      <Button variant="outline" className="w-full">
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Account Status</Label>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-destructive">Danger Zone</Label>
                      <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;