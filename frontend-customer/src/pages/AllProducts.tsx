import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Grid3X3, List, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

// Import fallback products data
import fallbackProductsData from "@/data/fallback-products.json";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  rating: number;
  category: string;
  source: string;
  availability: { stock: number; status: string };
  brand: string;
}

const AllProducts = () => {
  const { formatPrice } = useCurrency();
  const { t, isTranslating } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Extract products and categories from fallback data
  const categories = fallbackProductsData.categories || [];
  const allProducts: Product[] = [];

  // Flatten all products from all categories
  Object.entries(fallbackProductsData.products || {}).forEach(([categoryKey, products]) => {
    if (Array.isArray(products)) {
      products.forEach((product: any) => {
        allProducts.push({
          ...product,
          category: categoryKey
        });
      });
    }
  });

  // Filter and sort products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

    let matchesPrice = true;
    if (priceRange !== "all") {
      const price = product.price;
      switch (priceRange) {
        case "under-50": matchesPrice = price < 50; break;
        case "50-100": matchesPrice = price >= 50 && price < 100; break;
        case "100-250": matchesPrice = price >= 100 && price < 250; break;
        case "250-500": matchesPrice = price >= 250 && price < 500; break;
        case "over-500": matchesPrice = price >= 500; break;
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "name": return a.title.localeCompare(b.title);
      default: return 0; // featured - keep original order
    }
  });

  const getCategoryName = (categorySlug: string) => {
    const category = categories.find(cat => cat.id === categorySlug);
    return category ? category.name : categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
            {getCategoryName(product.category)}
          </Badge>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                <span className="text-xs">★</span>
                <span className="text-xs font-medium">{product.rating}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-muted-foreground">
                  by {product.brand}
                </p>
              </div>

              <Button size="sm" className="h-8 px-3">
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(product.category)}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span className="text-xs">★</span>
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="h-8 px-3 flex-shrink-0">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {product.brand}
                  </p>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full pb-20 md:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">
              All Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of premium products across all categories
            </p>
            {isTranslating && (
              <div className="text-sm text-muted-foreground">Translating...</div>
            )}
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="border-b bg-background/95 backdrop-blur sticky top-16 z-40">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Toggle (Mobile) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-250">$100 - $250</SelectItem>
                  <SelectItem value="250-500">$250 - $500</SelectItem>
                  <SelectItem value="over-500">Over $500</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-50">Under $50</SelectItem>
                    <SelectItem value="50-100">$50 - $100</SelectItem>
                    <SelectItem value="100-250">$100 - $250</SelectItem>
                    <SelectItem value="250-500">$250 - $500</SelectItem>
                    <SelectItem value="over-500">Over $500</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="flex-1"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="flex-1"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="container px-4 md:px-6 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-light tracking-tight">
              {selectedCategory === "all" ? "All Products" : getCategoryName(selectedCategory)}
            </h2>
            <p className="text-muted-foreground">
              {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Products Display */}
        {sortedProducts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setPriceRange("all");
                setSortBy("featured");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default AllProducts;