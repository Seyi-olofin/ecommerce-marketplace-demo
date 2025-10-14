import { Star, BadgeCheck } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  avatar?: string;
  rating: number;
  review: string;
  verified?: boolean;
}

const TestimonialCard = ({ name, avatar, rating, review, verified = true }: TestimonialCardProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-card space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-medium">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" loading="lazy" />
          ) : (
            name.charAt(0)
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{name}</h4>
            {verified && <BadgeCheck className="h-4 w-4 text-accent" />}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < rating ? "fill-accent text-accent" : "text-muted"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-light leading-relaxed">{review}</p>
    </div>
  );
};

export default TestimonialCard;
