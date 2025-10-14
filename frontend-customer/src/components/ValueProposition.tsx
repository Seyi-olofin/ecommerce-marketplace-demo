import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ValuePropositionProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ValueProposition = ({ icon: Icon, title, description }: ValuePropositionProps) => {
  const handleClick = () => {
    // TODO: Open related info or policy page
    console.log(`Open ${title} info`);
  };

  return (
    <motion.div
      className="group flex flex-col items-center text-center space-y-3 p-6 rounded-lg hover:bg-secondary/50 transition-smooth cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-medium text-base">{title}</h3>
      <p className="text-sm text-muted-foreground font-light">{description}</p>
    </motion.div>
  );
};

export default ValueProposition;

