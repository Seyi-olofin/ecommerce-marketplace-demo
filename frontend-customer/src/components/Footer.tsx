import { Facebook, Twitter, Instagram, Youtube, CreditCard, Bitcoin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    About: [
      { name: "Our Story", path: "/about" },
      { name: "Careers", path: "#" },
      { name: "Press", path: "#" },
      { name: "Blog", path: "#" }
    ],
    "Help & Support": [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQs", path: "/faqs" },
      { name: "Shipping Info", path: "#" },
      { name: "Returns", path: "#" }
    ],
    Policies: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Refund Policy", path: "/refund-policy" }
    ],
  };

  return (
    <footer className="w-full border-t bg-secondary/30">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-lg">L</span>
              </div>
              <span className="text-xl font-light tracking-wide">LuxeMart</span>
            </div>
            <p className="text-sm text-muted-foreground font-light">
              Your trusted global marketplace for premium products worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="font-medium text-sm">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.path.startsWith('/') ? (
                      <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary font-light transition-smooth">
                        {link.name}
                      </Link>
                    ) : (
                      <a href={link.path} className="text-sm text-muted-foreground hover:text-primary font-light transition-smooth">
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 LuxeMart. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">We accept:</span>
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-8 text-muted-foreground" />
                <Bitcoin className="h-6 w-6 text-accent" />
                <span className="text-xs text-muted-foreground">+ more</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
