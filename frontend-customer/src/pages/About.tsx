import { motion } from "framer-motion";
import { Heart, Globe, Shield, Users, Star, Award, Target, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make puts our customers at the center of everything we do."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We maintain the highest standards of security and transparency in all our operations."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting customers worldwide with quality products from trusted sources."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly evolving to provide the best shopping experience possible."
    }
  ];

  const stats = [
    { number: "200+", label: "Countries Served" },
    { number: "1M+", label: "Happy Customers" },
    { number: "50K+", label: "Products Available" },
    { number: "99%", label: "Customer Satisfaction" }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      description: "Visionary leader with 15+ years in e-commerce innovation."
    },
    {
      name: "Marcus Johnson",
      role: "Head of Operations",
      description: "Expert in global supply chain and logistics management."
    },
    {
      name: "Elena Rodriguez",
      role: "Customer Experience Director",
      description: "Dedicated to creating exceptional shopping experiences."
    }
  ];

  return (
    <div className="min-h-screen w-full">
      <Header />

      <div className="container px-4 md:px-6 py-12 md:py-20">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
            About <span className="font-semibold text-primary">LuxeMart</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing global e-commerce by connecting customers with premium products
            from trusted vendors worldwide, all while maintaining uncompromising standards of quality and service.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-lg">
            <CardContent className="p-8 md:p-12 text-center">
              <Target className="h-12 w-12 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-light mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                To democratize access to premium products by creating a seamless, trustworthy marketplace
                that empowers customers to shop globally with confidence, while supporting ethical vendors
                and sustainable practices worldwide.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Stats */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every decision we make and every interaction we have.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Story */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-light mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2020, LuxeMart began as a simple idea: to make premium products
                  accessible to everyone, regardless of their location. What started as a small
                  online marketplace has grown into a global platform serving millions of customers.
                </p>
                <p>
                  We've built lasting partnerships with trusted vendors worldwide, ensuring that
                  every product meets our rigorous standards for quality, authenticity, and sustainability.
                  Our commitment to excellence has earned us the trust of customers in over 200 countries.
                </p>
                <p>
                  Today, we're not just an e-commerce platform – we're a community of shoppers,
                  vendors, and innovators working together to redefine the future of global commerce.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                <Award className="h-24 w-24 text-primary" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals driving our mission forward every day.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0 shadow-lg">
            <CardContent className="p-8 md:p-12">
              <Star className="h-12 w-12 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-light mb-4">Join Our Community</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Be part of a global community that values quality, trust, and exceptional service.
                Start shopping with LuxeMart today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                  <Link to="/">Start Shopping</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default About;