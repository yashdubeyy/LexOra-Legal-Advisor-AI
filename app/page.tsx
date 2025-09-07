"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ScaleIcon, 
  DocumentTextIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  PencilSquareIcon,
  StarIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

// Animation for text typing effect
const TypeAnimation = ({ text, speed = 75 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return <span>{displayedText}</span>;
};

// Note: We'll use motion.div with whileInView prop instead of a custom component

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with animated background */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 -z-10">
          <div className="absolute inset-0 opacity-20 dark:opacity-20">
            <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-300 dark:text-blue-700" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        {/* Floating elements in background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {isLoaded && (
            <>
              <motion.div
                className="absolute h-40 w-40 rounded-full bg-blue-500/20 dark:bg-blue-500/10"
                style={{ top: '15%', left: '10%' }}
                animate={{ 
                  y: [0, -20, 0], 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              />
              <motion.div
                className="absolute h-24 w-24 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5"
                style={{ top: '60%', right: '15%' }}
                animate={{ 
                  y: [0, 30, 0], 
                  scale: [1, 0.9, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              />
              <motion.div
                className="absolute h-32 w-32 rounded-full bg-amber-500/10 dark:bg-amber-500/5"
                style={{ bottom: '20%', left: '20%' }}
                animate={{ 
                  y: [0, 20, 0], 
                  x: [0, 15, 0],
                  opacity: [0.15, 0.3, 0.15]
                }}
                transition={{ repeat: Infinity, duration: 9, ease: "easeInOut", delay: 2 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              />
            </>
          )}
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -left-4 -top-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                      scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                    }}
                    className="text-amber-500 dark:text-amber-400"
                  >
                    <SparklesIcon className="h-6 w-6" />
                  </motion.div>
                </div>
                
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                  Powered by AI
                </span>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                  <span className="block">Legal Advice with</span> 
                  <span className="relative">
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      <TypeAnimation text="Intelligent Precision" speed={60} />
                    </span>
                    <motion.span 
                      className="absolute -bottom-2 left-0 h-1 bg-blue-500 dark:bg-blue-400" 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.8, duration: 1, ease: "easeInOut" }}
                    />
                  </span>
                </h1>
                
                <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-xl">
                  <strong className="font-medium text-blue-800 dark:text-blue-300">LexOra</strong> combines advanced AI and legal expertise to provide accessible, accurate legal assistance for navigating Indian law confidently.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/assistant">
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative inline-flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-200 font-medium overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>
                      <span className="relative flex items-center">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                        <span className="mr-1">Try Legal Assistant</span>
                        <motion.span 
                          className="inline-block"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5 }}
                        >
                          <ArrowRightIcon className="h-4 w-4" />
                        </motion.span>
                      </span>
                    </motion.button>
                  </Link>
                  <Link href="/articles">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center px-8 py-3.5 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium border border-gray-200 dark:border-gray-700"
                    >
                      <BookOpenIcon className="h-5 w-5 mr-2" />
                      Browse Articles
                    </motion.button>
                  </Link>
                </div>
                
                <div className="mt-12 flex items-center">
                  <div className="flex -space-x-2">
                    {[
                      "bg-blue-100 text-blue-800", 
                      "bg-amber-100 text-amber-800", 
                      "bg-indigo-100 text-indigo-800",
                      "bg-emerald-100 text-emerald-800"
                    ].map((color, i) => (
                      <div key={i} className={`h-8 w-8 rounded-full ${color} dark:opacity-75 flex items-center justify-center text-xs font-medium`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">5,000+</span> legal issues analyzed this month
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -top-16 right-0 md:right-12 hidden md:block"
              >
                <motion.div 
                  className="text-amber-500 dark:text-amber-400"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut"
                  }}
                >
                  <StarIcon className="h-8 w-8" />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative w-full max-w-md"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 dark:from-blue-600/30 dark:to-indigo-600/30 rounded-3xl blur-xl"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-blue-100 dark:border-blue-900 p-6 md:p-8 max-w-lg overflow-hidden">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <ScaleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal Analysis</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered legal assistance</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <motion.div 
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-gray-800 dark:text-gray-200"
                    >
                      My neighbor has built a wall that extends onto my property. What legal actions can I take?
                    </motion.div>
                    <motion.div 
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-sm text-gray-800 dark:text-gray-200 ml-6"
                    >
                      <p className="font-medium mb-1">Legal Analysis:</p>
                      <p>This appears to be a case of encroachment under property law. You can take the following actions:</p>
                      <ol className="list-decimal pl-5 mt-2 space-y-1">
                        <li>Send a formal notice asking to remove the wall</li>
                        <li>File a civil suit for mandatory injunction</li>
                        <li>Seek remedy under Specific Relief Act</li>
                      </ol>
                    </motion.div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Powered by LexOra</div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">Try Now →</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">How LexOra Helps You</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Our AI-powered platform simplifies Indian law, making legal assistance accessible to everyone
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <DocumentMagnifyingGlassIcon className="h-7 w-7" />,
                title: "Case Analysis",
                description: "Our AI analyzes your legal situation and identifies key issues based on Indian law principles."
              },
              {
                icon: <ShieldCheckIcon className="h-7 w-7" />,
                title: "Relevant IPC Sections",
                description: "Quickly find applicable Indian Penal Code sections related to your legal matter."
              },
              {
                icon: <BookOpenIcon className="h-7 w-7" />,
                title: "Legal Precedents",
                description: "Access similar cases and precedents to understand how courts have ruled in the past."
              },
              {
                icon: <PencilSquareIcon className="h-7 w-7" />,
                title: "Document Drafting",
                description: "Generate preliminary legal documents based on your specific situation."
              },
              {
                icon: <DocumentTextIcon className="h-7 w-7" />,
                title: "Legal Knowledge",
                description: "Browse our comprehensive collection of articles on Indian law and legal procedures."
              },
              {
                icon: <ChatBubbleLeftRightIcon className="h-7 w-7" />,
                title: "Simple Interaction",
                description: "Describe your issue in plain language and get legal information in easy-to-understand terms."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Navigate Indian Law with Confidence?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Start using our AI legal assistant today and get insights on your legal questions
            </p>
            <Link href="/assistant">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-blue-700 rounded-lg shadow-lg transition-all duration-200 font-medium text-lg"
              >
                Get Started Now
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
