import { motion } from "framer-motion";
import { FileText, Users, Shield, AlertTriangle, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  const sections = [
    {
      icon: Users,
      title: "User Accounts",
      content: [
        "You must be at least 18 years old to create an account",
        "Provide accurate and complete information during registration",
        "You are responsible for maintaining account security",
        "One account per user - multiple accounts may be suspended",
        "Notify us immediately of any unauthorized account access"
      ]
    },
    {
      icon: Shield,
      title: "Acceptable Use",
      content: [
        "Use the platform only for lawful purposes",
        "Do not engage in fraudulent or deceptive activities",
        "Respect intellectual property rights",
        "Do not attempt to hack or compromise the platform",
        "Report any security vulnerabilities you discover"
      ]
    },
    {
      icon: FileText,
      title: "Orders & Payments",
      content: [
        "All orders are subject to acceptance and availability",
        "Prices may change without prior notice",
        "Payment must be received before order processing",
        "We reserve the right to refuse or cancel orders",
        "Taxes and shipping costs are additional"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Liability & Disclaimers",
      content: [
        "Products are provided 'as is' without warranties",
        "We are not liable for indirect or consequential damages",
        "Maximum liability limited to purchase price",
        "Force majeure events may affect service delivery",
        "User content is uploaded at user's own risk"
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
              <FileText className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Rules and guidelines for using LuxeMart
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
              <span className="text-foreground font-medium">Terms of Service</span>
            </nav>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Welcome to LuxeMart. These Terms of Service ("Terms") govern your use of our e-commerce platform and services.
                By accessing or using our platform, you agree to be bound by these Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Please read these Terms carefully. If you do not agree to these Terms, please do not use our platform.
                We reserve the right to modify these Terms at any time, with changes taking effect immediately upon posting.
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

          {/* Termination */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We reserve the right to terminate or suspend your account and access to our services at our sole discretion,
                without prior notice, for conduct that we believe violates these Terms or is harmful to other users,
                us, or third parties, or for any other reason.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Upon termination:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Your right to use our services immediately ceases</li>
                  <li>• We may delete your account and data</li>
                  <li>• Outstanding payments remain due</li>
                  <li>• Certain provisions survive termination</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                without regard to its conflict of law provisions. Any disputes arising from these Terms shall be
                resolved exclusively in the courts of [Your Jurisdiction].
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">legal@luxemart.com</p>
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

          {/* Related Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Related Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/privacy"
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">Privacy Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how we protect your personal information
                  </p>
                </Link>
                <Link
                  to="/cookies"
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">Cookie Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Information about our cookie usage
                  </p>
                </Link>
                <Link
                  to="/refund-policy"
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">Refund Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Details about returns and refunds
                  </p>
                </Link>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">User Guidelines</h3>
                  <p className="text-sm text-muted-foreground">
                    Best practices for using our platform
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

export default TermsOfService;