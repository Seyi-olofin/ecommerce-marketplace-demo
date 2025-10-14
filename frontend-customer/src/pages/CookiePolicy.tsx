import { motion } from "framer-motion";
import { Cookie, Settings, Eye, Database, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const CookiePolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Essential Cookies",
      content: [
        "Required for website functionality and security",
        "Enable basic shopping cart and checkout features",
        "Remember your login status and preferences",
        "Process payments and order information",
        "Cannot be disabled as they are necessary for the site to work"
      ]
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      content: [
        "Remember your language and currency preferences",
        "Save your shopping preferences and wishlist",
        "Keep items in your cart between visits",
        "Personalize your browsing experience",
        "Improve site performance and speed"
      ]
    },
    {
      icon: Database,
      title: "Analytics Cookies",
      content: [
        "Help us understand how visitors use our site",
        "Track page views, click patterns, and user flow",
        "Measure the effectiveness of our marketing",
        "Identify technical issues and improve performance",
        "Data is aggregated and anonymized"
      ]
    },
    {
      icon: Cookie,
      title: "Marketing Cookies",
      content: [
        "Show relevant advertisements based on your interests",
        "Remember products you've viewed",
        "Track conversion from ads to purchases",
        "Personalize product recommendations",
        "Measure advertising campaign effectiveness"
      ]
    }
  ];

  const cookieTable = [
    { name: "session_id", purpose: "Maintains your login session", type: "Essential", duration: "Session" },
    { name: "cart_items", purpose: "Stores items in your shopping cart", type: "Functional", duration: "30 days" },
    { name: "user_preferences", purpose: "Remembers your language and currency", type: "Functional", duration: "1 year" },
    { name: "analytics_id", purpose: "Tracks site usage for improvements", type: "Analytics", duration: "2 years" },
    { name: "marketing_id", purpose: "Personalizes ads and recommendations", type: "Marketing", duration: "1 year" }
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
              <Cookie className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-xl text-muted-foreground mb-2">
              How we use cookies to improve your experience
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
              <span className="text-foreground font-medium">Cookie Policy</span>
            </nav>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website.
                At LuxeMart, we use cookies to enhance your browsing experience, analyze site traffic,
                and personalize content and advertisements.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies.
                By continuing to use our website, you consent to our use of cookies in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* What are Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">First-party Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Set directly by our website to remember your preferences and improve your experience.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Third-party Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Set by our partners and service providers for analytics, advertising, and social media features.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Session Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Temporary cookies that expire when you close your browser.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Persistent Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Cookies that remain on your device for a set period or until you delete them.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Categories */}
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

          {/* Cookie Details Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Cookie Name</th>
                      <th className="text-left py-2 font-medium">Purpose</th>
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-left py-2 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieTable.map((cookie, index) => (
                      <tr key={index} className="border-b border-muted/50">
                        <td className="py-3 font-mono text-xs">{cookie.name}</td>
                        <td className="py-3">{cookie.purpose}</td>
                        <td className="py-3">
                          <Badge variant="outline" className="text-xs">
                            {cookie.type}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">{cookie.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Browser Settings</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Chrome: Settings → Privacy and security → Cookies and other site data</li>
                    <li>• Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
                    <li>• Safari: Preferences → Privacy → Manage Website Data</li>
                    <li>• Edge: Settings → Cookies and site permissions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Opt-out Options</h4>
                  <p className="text-sm text-muted-foreground">
                    You can opt out of interest-based advertising by visiting the Network Advertising Initiative
                    opt-out page or the Digital Advertising Alliance opt-out page.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website
                    and limit your ability to use some features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Us About Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies, please contact us:
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
                  to="/refund-policy"
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium mb-2">Refund Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Details about returns and refunds
                  </p>
                </Link>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Cookie Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your cookie preferences
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

export default CookiePolicy;