import { motion } from "framer-motion";
import { RotateCcw, Clock, Package, CreditCard, AlertTriangle, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  const refundScenarios = [
    {
      icon: Clock,
      title: "Within 30 Days",
      description: "Full refund for unused items in original condition",
      eligible: true
    },
    {
      icon: Package,
      title: "Damaged Items",
      description: "Full refund or replacement for damaged products",
      eligible: true
    },
    {
      icon: CreditCard,
      title: "Wrong Item",
      description: "Full refund if you received the wrong product",
      eligible: true
    },
    {
      icon: AlertTriangle,
      title: "After 30 Days",
      description: "Case-by-case evaluation for special circumstances",
      eligible: false
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: "Contact Us",
      description: "Email us at returns@luxemart.com with your order number and reason for return",
      icon: Mail
    },
    {
      step: 2,
      title: "Return Authorization",
      description: "We'll provide a return authorization number and shipping label",
      icon: Package
    },
    {
      step: 3,
      title: "Ship the Item",
      description: "Pack the item securely and ship it back using the provided label",
      icon: RotateCcw
    },
    {
      step: 4,
      title: "Refund Processing",
      description: "Once received and inspected, we'll process your refund within 5-7 business days",
      icon: CreditCard
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
              <RotateCcw className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Hassle-free returns and refunds
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
              <span className="text-foreground font-medium">Refund Policy</span>
            </nav>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                At LuxeMart, we want you to be completely satisfied with your purchase. If you're not happy with your order,
                our 30-day return policy makes it easy to return items for a full refund.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Please review our refund policy below. All returns are subject to inspection and approval.
                We reserve the right to refuse returns that don't meet our policy requirements.
              </p>
            </CardContent>
          </Card>

          {/* Refund Eligibility */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Refund Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {refundScenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${scenario.eligible ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50/50'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scenario.eligible ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <scenario.icon className={`h-4 w-4 ${scenario.eligible ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <h4 className="font-medium">{scenario.title}</h4>
                      {scenario.eligible && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Eligible</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Refund Process */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How to Request a Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {refundProcess.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{step.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <step.icon className="h-4 w-4 text-primary" />
                        <h4 className="font-medium">{step.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Refund Conditions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Return Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Items must be:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      In original, unused condition with all tags attached
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      In original packaging with all accessories included
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Free from damage, stains, or signs of wear
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      Returned within 30 days of delivery
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Non-returnable items:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Personalized or custom-made items</li>
                    <li>• Items damaged due to misuse or normal wear</li>
                    <li>• Items missing original packaging or accessories</li>
                    <li>• Digital products or downloadable content</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Methods */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Refund Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Original Payment Method</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Refunds are processed to the original payment method used for the purchase.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Credit/Debit Cards: 5-7 business days</li>
                    <li>• PayPal: 1-3 business days</li>
                    <li>• Bank Transfer: 5-10 business days</li>
                    <li>• Cryptocurrency: 1-2 business days</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Processing Time</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Once your return is approved, refunds are typically processed within:
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Return inspection:</span>
                      <span className="font-medium">1-2 business days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Refund processing:</span>
                      <span className="font-medium">3-5 business days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bank processing:</span>
                      <span className="font-medium">2-7 business days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Costs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Shipping Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Free Returns</h4>
                  <p className="text-sm text-muted-foreground">
                    We provide free return shipping for all approved returns within the continental US.
                    International customers may be responsible for return shipping costs.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Original Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    Original shipping costs are not refunded unless the return is due to our error
                    (wrong item shipped, damaged item, etc.).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Us About Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Have questions about our refund policy or need to initiate a return? Contact our customer service team:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Returns Email</p>
                    <p className="text-sm text-muted-foreground">returns@luxemart.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Customer Service</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Our customer service team is available Monday-Friday, 9 AM - 6 PM EST.
              </p>
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
                  to="/terms"
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">Terms of Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Read our terms and conditions
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
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Shipping Info</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn about our shipping and delivery options
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

export default RefundPolicy;