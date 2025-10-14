import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/api";

interface CategoryPreviewSectionProps {
  categoryName: string;
  categorySlug: string;
  products: Product[];
  loading?: boolean;
  maxProducts?: number;
}

const CategoryPreviewSection = ({
  categoryName,
  categorySlug,
  products,
  loading = false,
  maxProducts = 10
}: CategoryPreviewSectionProps) => {
  const displayProducts = products.slice(0, maxProducts);

  // Generate fallback image URL for categories without specific images
  const getFallbackImage = (categorySlug: string, productId: string) => {
    const categoryImages: Record<string, string> = {
      'electronics': `https://source.unsplash.com/random/600x600/?electronics,technology,gadget`,
      'mens-shirts': `https://source.unsplash.com/random/600x600/?mens-fashion,shirt,clothing`,
      'womens-fashion': `https://source.unsplash.com/random/600x600/?womens-fashion,dress,clothing`,
      'shoes': `https://source.unsplash.com/random/600x600/?shoes,sneakers,footwear`,
      'sports': `https://source.unsplash.com/random/600x600/?sports,fitness,equipment`,
      'beauty-skincare': `https://source.unsplash.com/random/600x600/?beauty,skincare,cosmetics`,
      'home-garden': `https://source.unsplash.com/random/600x600/?home,interior,garden`,
      'laptops': `https://source.unsplash.com/random/600x600/?laptop,computer,technology`,
      'automotive': `https://source.unsplash.com/random/600x600/?car,automotive,vehicle`,
      'motorcycle': `https://source.unsplash.com/random/600x600/?motorcycle,bike,vehicle`
    };
    return categoryImages[categorySlug] || `https://source.unsplash.com/random/600x600/?product,shopping`;
  };

  return (
    <motion.section
      className="w-full bg-background border-b border-border/50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container px-4 md:px-6 py-12 md:py-16">
        {/* Category Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-2">
            {categoryName}
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
          {loading ? (
            // Loading skeletons
            Array.from({ length: maxProducts }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <ProductCard
                  id={product.id}
                  name={product.title}
                  description={product.description}
                  price={product.price.amount}
                  currency={product.price.currency}
                  rating={product.rating}
                  image={product.thumbnail || getFallbackImage(categorySlug, product.id)}
                  source={product.source}
                  product={product}
                  showDescription={true}
                  className="h-full"
                />
              </motion.div>
            ))
          )}
        </div>

        {/* See More Button */}
        <div className="flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
          >
            <Link to={`/products/${categorySlug}`}>
              See More {categoryName}
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default CategoryPreviewSection;