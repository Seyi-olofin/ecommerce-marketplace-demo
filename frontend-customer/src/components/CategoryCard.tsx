import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  categoryId?: string;
  icon?: LucideIcon;
  image?: string;
  subcategories?: Array<{
    id: string | number;
    name: string;
    image?: string;
  }>;
  onSubcategoryClick?: (subcategoryId: string | number) => void;
}

const CategoryCard = memo(({ title, categoryId, icon: Icon, image, subcategories, onSubcategoryClick }: CategoryCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Normalize category name to slug for navigation
  const normalizeCategory = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleClick = useCallback(() => {
    // Use categoryId if provided, otherwise normalize the title
    const slug = categoryId || normalizeCategory(title);
    navigate(`/category/${encodeURIComponent(slug)}`);
  }, [navigate, title, categoryId]);

  const handleSubcategoryClick = useCallback((subcategoryId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSubcategoryClick) {
      onSubcategoryClick(subcategoryId);
    } else {
      navigate(`/category/${encodeURIComponent(subcategoryId.toString())}`);
    }
  }, [navigate, onSubcategoryClick]);

  // Capitalize the display title
  const displayTitle = title.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="relative">
      <motion.div
        className="group cursor-pointer"
        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-lg bg-card shadow-card aspect-square">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                // Fallback to a default image if the image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
              {Icon && <Icon className="w-16 h-16 text-primary/40" />}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth"></div>
        </div>
        <h3 className="mt-3 text-center text-sm md:text-base font-light tracking-wide">{displayTitle}</h3>
      </motion.div>

      {/* Subcategories Dropdown */}
      {subcategories && subcategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : -10
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute top-full left-0 right-0 z-50 mt-2 bg-background border rounded-lg shadow-lg p-2 min-w-max",
            isHovered ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <div className="grid grid-cols-2 gap-1">
            {subcategories.slice(0, 6).map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={(e) => handleSubcategoryClick(subcategory.id, e)}
                className="text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap"
              >
                {subcategory.name}
              </button>
            ))}
          </div>
          {subcategories.length > 6 && (
            <button
              onClick={handleClick}
              className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-accent rounded-md transition-colors"
            >
              View All ({subcategories.length})
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
});

export default CategoryCard;
