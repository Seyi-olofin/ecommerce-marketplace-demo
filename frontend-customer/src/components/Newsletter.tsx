import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="w-full gradient-subtle py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">Stay in the Loop</h2>
          <p className="text-base md:text-lg text-muted-foreground font-light">
            Get deals & drops delivered to your inbox
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
            <Button variant="hero" size="lg" type="submit" className="px-8">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
