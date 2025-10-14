import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CategoryCard from "@/components/CategoryCard";
import { cachedApi, Category } from "@/lib/api";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const AllCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await cachedApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="min-h-screen w-full pb-20 md:pb-0">
      <Header />
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-3">All Categories</h1>
            <p className="text-muted-foreground font-light">Explore all our product categories</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, subIndex) => (
                      <div key={subIndex} className="h-20 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.id} className="border-b border-border pb-6 last:border-b-0">
                  {/* Main Category */}
                  <div
                    className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-accent/50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                      {category.description && (
                        <p className="text-muted-foreground text-sm">{category.description}</p>
                      )}
                    </div>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category.id.toString());
                        }}
                        className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
                      >
                        {expandedCategories.has(category.id.toString()) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: expandedCategories.has(category.id.toString()) ? "auto" : 0,
                        opacity: expandedCategories.has(category.id.toString()) ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-20">
                        {category.subcategories.map((subcategory) => (
                          <CategoryCard
                            key={subcategory.id}
                            title={subcategory.name}
                            image={subcategory.image}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default AllCategories;