import { motion } from "framer-motion";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Orders & Payment",
      questions: [
        {
          question: "How do I place an order?",
          answer: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, cryptocurrency, and bank transfers. All payments are processed securely."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard SSL encryption and work with trusted payment processors to ensure your financial information is always protected."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "Orders can be modified or cancelled within 1 hour of placement. Contact our support team immediately if you need to make changes."
        }
      ]
    },
    {
      category: "Shipping & Delivery",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-7 business days. Express shipping (2-3 days) and overnight options are available for select locations."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to over 200 countries worldwide. International shipping costs and delivery times vary by location."
        },
        {
          question: "How can I track my order?",
          answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order status in your account dashboard."
        },
        {
          question: "What if my package is damaged or lost?",
          answer: "Contact our support team immediately with your order number. We'll investigate and provide a replacement or refund as appropriate."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return window for most items. Items must be unused, in original packaging, with all tags and accessories included."
        },
        {
          question: "How do I initiate a return?",
          answer: "Log into your account, go to your orders, and select the return option. Follow the instructions to print your return label."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-5 business days after we receive your returned item. The time to appear in your account depends on your payment method."
        },
        {
          question: "Are there any items that cannot be returned?",
          answer: "Personal care items, custom orders, and certain electronics cannot be returned for hygiene and safety reasons."
        }
      ]
    },
    {
      category: "Account & Support",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button in the header and fill out the registration form. You'll receive a confirmation email to verify your account."
        },
        {
          question: "I forgot my password. What should I do?",
          answer: "Click 'Forgot Password' on the login page and enter your email address. We'll send you a secure link to reset your password."
        },
        {
          question: "How can I contact customer support?",
          answer: "You can reach us via email at support@luxemart.com, through our contact form, or by phone during business hours."
        },
        {
          question: "Do you offer live chat support?",
          answer: "Yes, our live chat feature is available during business hours (9 AM - 6 PM EST) for immediate assistance with your questions."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
            Frequently Asked <span className="font-semibold text-primary">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Find quick answers to common questions about our products, orders, shipping, and more.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary transition-colors">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Still Need Help */}
        <motion.section
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-0 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <HelpCircle className="h-12 w-12 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl font-light mb-4">Still Need Help?</h2>
              <p className="text-muted-foreground mb-8">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Contact Support
                </a>
                <a href="mailto:support@luxemart.com" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  Email Us
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default FAQs;