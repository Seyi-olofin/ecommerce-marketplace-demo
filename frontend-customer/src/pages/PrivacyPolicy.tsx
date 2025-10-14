import { motion } from "framer-motion";
import { Shield, Eye, Lock, Users, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, phone, address)",
        "Payment information for order processing",
        "Browsing history and preferences",
        "Device information and IP addresses",
        "Location data for shipping purposes"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Provide customer support and communication",
        "Improve our products and services",
        "Send marketing communications (with consent)",
        "Ensure platform security and prevent fraud"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "With service providers for order fulfillment",
        "Payment processors for secure transactions",
        "Shipping partners for delivery",
        "Legal authorities when required by law",
        "Never sold to third parties for marketing"
      ]
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "Industry-standard encryption for all data",
        "Regular security audits and updates",
        "Secure payment processing (PCI compliant)",
        "Employee access controls and training",
        "Data minimization and retention policies"
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full">
      <Header />

      <div className="container px-4 md:px-6 py-8 md:py-12 pb-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Your privacy is important to us
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Breadcrumbs */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground font-medium">Privacy Policy</span>
            </nav>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                At LuxeMart, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our e-commerce platform.
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div className="grid gap-6 mb-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Us About Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">privacy@luxemart.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Related Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/terms"
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">Terms of Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Read our terms and conditions for using LuxeMart
                  </p>
                </Link>
                <Link
                  to="/cookies"
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">Cookie Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn about our use of cookies and tracking
                  </p>
                </Link>
                <Link
                  to="/refund-policy"
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">Refund Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Information about returns and refunds
                  </p>
                </Link>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Data Rights</h3>
                  <p className="text-sm text-muted-foreground">
                    You have rights to access, update, and delete your data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;