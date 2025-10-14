import { Search, Heart, ShoppingCart, User, Globe, Camera, ChevronDown, LogIn, UserPlus, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";
import { fetchCategories, cachedApi, Product, Category } from "@/lib/api";

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const Header = () => {
  const { getTotalItems } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated, user } = useAuthContext();
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const { language, setLanguage, supportedLanguages, t, isTranslating } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchSuggestions([]);
        return;
      }

      try {
        const results = await cachedApi.getProducts(`limit=5&offset=0&q=${encodeURIComponent(query)}`);
        // Handle both array and object responses
        const products = Array.isArray(results) ? results : (results as any).products || [];
        setSearchSuggestions(products);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-4 md:mr-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-lg">L</span>
          </div>
          <span className="text-xl font-light tracking-wide hidden sm:inline-block">LuxeMart</span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-3xl mx-4">
          <div className="flex gap-2 items-center w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[140px] h-10 justify-between">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                {categories.map((cat) => {
                  const categorySlug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  console.log('Header - category:', cat.name, '-> slug:', categorySlug);
                  return (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() => {
                        console.log('Header - navigating to category:', categorySlug);
                        navigate(`/category/${categorySlug}`);
                      }}
                    >
                      {cat.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search products, brands…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full h-10 pl-10 pr-12 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={clearSearch}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </Button>

                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-background border border-input rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto mt-1">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.title}</p>
                          <p className="text-xs text-muted-foreground">${product.price.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSearchSubmit}
              >
                Search
              </Button>
          </div>
        </div>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="w-[80px] h-8 border-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedCurrencies.slice(0, 20).map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{curr.code}</span>
                    <span className="text-muted-foreground">{curr.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[70px] h-8 border-none bg-transparent">
              <Globe className="h-7 w-7 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.slice(0, 50).map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-muted-foreground">({lang.name})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isTranslating && (
            <div className="text-xs text-muted-foreground">Translating...</div>
          )}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                {getTotalItems()}
              </span>
            </Link>
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/account/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth/signup" className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                {getTotalItems()}
              </span>
            </Link>
          </Button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                {/* Mobile Search */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button className="w-full" onClick={handleSearchSubmit}>
                    Search
                  </Button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="font-medium">Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 8).map((cat) => {
                      const categorySlug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      console.log('Mobile Header - category:', cat.name, '-> slug:', categorySlug);
                      return (
                        <Button
                          key={cat.id}
                          variant="ghost"
                          className="justify-start h-10"
                          onClick={() => {
                            console.log('Mobile Header - navigating to category:', categorySlug);
                            navigate(`/category/${categorySlug}`);
                            setMobileMenuOpen(false);
                          }}
                        >
                          {cat.name}
                        </Button>
                      );
                    })}
                  </div>
                  <Button variant="ghost" className="justify-start h-10" onClick={() => {
                    navigate('/all-categories');
                    setMobileMenuOpen(false);
                  }}>
                    View All Categories
                  </Button>
                  <Button variant="ghost" className="justify-start h-10" onClick={() => {
                    navigate('/all-products');
                    setMobileMenuOpen(false);
                  }}>
                    All Products
                  </Button>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedCurrencies.slice(0, 20).map((curr) => (
                          <SelectItem key={curr.code} value={curr.code}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{curr.name}</span>
                              <span className="text-muted-foreground">({curr.symbol})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <Globe className="h-7 w-7 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguages.slice(0, 60).map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{lang.nativeName}</span>
                              <span className="text-xs text-muted-foreground">({lang.name})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isTranslating && (
                      <div className="text-xs text-muted-foreground">Translating...</div>
                    )}
                  </div>
                </div>

                {/* Auth */}
                <div className="space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/account/profile" onClick={() => setMobileMenuOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                          <Heart className="h-4 w-4 mr-2" />
                          Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
