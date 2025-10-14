import { Home, Grid3x3, ShoppingCart, Heart, User, Tags } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MobileBottomNav = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "categories", label: "Categories", icon: Tags, path: "/all-categories" },
    { id: "cart", label: "Cart", icon: ShoppingCart, path: "/cart" },
    { id: "wishlist", label: "Wishlist", icon: Heart, path: "/wishlist" },
    { id: "profile", label: "Profile", icon: User, path: "/account/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
          return (
            <Link
              key={id}
              to={path}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-smooth ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-xs font-light">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
