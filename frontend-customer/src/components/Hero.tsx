import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Hero = () => {
  const slides = [
    {
      title: "Discover Global Treasures",
      subtitle: "Premium products delivered worldwide",
      cta: "Shop Now",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=600&fit=crop"
    },
    {
      title: "Unbeatable Deals Daily",
      subtitle: "Save big on top brands and trending items",
      cta: "Explore Deals",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop"
    },
    {
      title: "Shop with Confidence",
      subtitle: "Secure payments • Fast shipping • Easy returns",
      cta: "Start Shopping",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=600&fit=crop"
    }
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-accent">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="grid md:grid-cols-2 gap-6 items-center min-h-[400px]">
                  {/* Left: Text Content */}
                  <div className="space-y-6 text-white z-10">
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-light max-w-lg">
                      {slide.subtitle}
                    </p>
                    <div className="flex gap-4 pt-4">
                      <Button variant="secondary" size="lg" className="gap-2 px-8 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300">
                        {slide.cta}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Right: Product Image */}
                  <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Arrows */}
          <CarouselPrevious className="left-4 bg-white/90 hover:bg-white text-primary border-0 shadow-lg" />
          <CarouselNext className="right-4 bg-white/90 hover:bg-white text-primary border-0 shadow-lg" />
        </Carousel>
      </div>
    </section>
  );
};

export default Hero;
