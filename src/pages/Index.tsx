
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone, QrCode, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export function Index() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkUser = async () => {
      const user = getCurrentUser();
      
      if (user) {
        navigate(user.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => {
      checkUser();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <motion.div 
              className="flex-1 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                Secure Digital ID Solution
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                QR Card <span className="text-brand-purple">Vault</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Modern digital identity cards with QR code verification. Secure, portable, and instantly verifiable credentials for your organization.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" onClick={() => navigate("/login")}>
                  Log In
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md">
                {/* Card Mockup */}
                <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-300">
                  <div className="bg-brand-purple py-2 text-center text-white font-medium text-sm">
                    DIGITAL ID CARD
                  </div>
                  <div className="p-6 text-white">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold">
                        ID
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold">John Doe</h3>
                        <p className="text-sm text-gray-300">john.doe@example.com</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-gray-700 py-1">
                        <span className="text-gray-400">ID</span>
                        <span>1234-5678</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 py-1">
                        <span className="text-gray-400">Status</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 py-1">
                        <span className="text-gray-400">Issued</span>
                        <span>May 10, 2023</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-white p-3 rounded-lg flex justify-center">
                      <QrCode className="text-gray-900 w-20 h-20" />
                    </div>
                  </div>
                </div>
                
                {/* Card Shadow */}
                <div className="absolute inset-0 bg-gray-900 rounded-xl -z-10 transform rotate-6 scale-95 translate-x-4 translate-y-4 opacity-30 blur-sm"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-2">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for secure, digital identity management in one powerful platform
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="h-7 w-7 text-brand-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">QR Code Verification</h3>
                  <p className="text-gray-600">
                    Instantly verify identity cards with a quick scan. No special hardware required.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Enhanced Security</h3>
                  <p className="text-gray-600">
                    Digital cards with encryption that can't be easily duplicated or forged.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Mobile Ready</h3>
                  <p className="text-gray-600">
                    Access your digital card from any device, anywhere, anytime.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <UserCheck className="h-7 w-7 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Admin Control</h3>
                  <p className="text-gray-600">
                    Manage users, validate cards, and approve profile updates.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 text-red-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">PDF Export</h3>
                  <p className="text-gray-600">
                    Download your digital card as a PDF for physical printing if needed.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="bg-indigo-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 text-indigo-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Customizable</h3>
                  <p className="text-gray-600">
                    Tailor the system to your organization's specific needs and requirements.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-purple to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-gray-100">
              Join thousands of organizations already using QR Card Vault for their digital ID solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" onClick={() => navigate("/register")}>
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-white text-xl font-bold mb-4">QR Card Vault</h3>
              <p className="max-w-xs">
                Secure, modern digital identity solutions for organizations of all sizes.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-medium mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2023 QR Card Vault. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
