import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cachedApi, Product } from "@/lib/api";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'relevance';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: category,
    rating: ''
  });

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        // Build search parameters
        const searchParams = new URLSearchParams({
          q: query,
          limit: '20',
          offset: ((currentPage - 1) * 20).toString()
        });

        if (filters.category) searchParams.set('category', filters.category);
        if (filters.minPrice) searchParams.set('minPrice', filters.minPrice);
        if (filters.maxPrice) searchParams.set('maxPrice', filters.maxPrice);
        if (filters.rating) searchParams.set('rating', filters.rating);
        if (sort !== 'relevance') searchParams.set('sort', sort);

        const results = await cachedApi.getProducts(searchParams.toString());

        if (Array.isArray(results)) {
          if (currentPage === 1) {
            setProducts(results);
            setTotalResults(results.length);
          } else {
            setProducts(prev => [...prev, ...results]);
          }
          setHasMore(results.length === 20);
        } else if (results && typeof results === 'object' && 'products' in results && Array.isArray((results as any).products)) {
          if (currentPage === 1) {
            setProducts((results as any).products);
            setTotalResults((results as any).total || (results as any).products.length);
          } else {
            setProducts(prev => [...prev, ...(results as any).products]);
          }
          setHasMore((results as any).hasMore || (results as any).products.length === 20);
        } else {
          if (currentPage === 1) {
            setProducts([]);
            setTotalResults(0);
          }
          setHasMore(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        if (currentPage === 1) {
          setProducts([]);
          setTotalResults(0);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, filters, sort, currentPage]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sort', value);
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      category: '',
      rating: ''
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">Price Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="mens-shirts">Men's Shirts</SelectItem>
            <SelectItem value="womens-fashion">Women's Fashion</SelectItem>
            <SelectItem value="beauty-skincare">Beauty & Skincare</SelectItem>
            <SelectItem value="home-garden">Home & Garden</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="shoes">Shoes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
        <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Any Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Rating</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="2">2+ Stars</SelectItem>
            <SelectItem value="1">1+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen w-full pb-20 md:pb-0">
      <Header />

      <div className="container px-4 md:px-6 py-8 md:py-12">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-2xl md:text-3xl font-light">
              Search Results for "{query}"
            </h1>
          </div>
          <p className="text-muted-foreground">
            {loading ? 'Searching...' : `${totalResults} results found`}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              <FilterContent />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                {totalResults} {totalResults === 1 ? 'result' : 'results'}
              </p>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
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
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      variant="outline"
                      size="lg"
                    >
                      Load More Results
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Search className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any products matching "{query}". Try adjusting your search terms or filters.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                  <Button asChild>
                    <Link to="/">Browse All Products</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;