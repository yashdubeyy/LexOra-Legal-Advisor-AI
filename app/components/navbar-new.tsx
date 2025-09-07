"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { 
  SunIcon, 
  MoonIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scrolling to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 dark:bg-gray-900/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center space-x-3 font-bold">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 6, ease: "easeInOut", repeatDelay: 5, repeat: Infinity }}
            className="w-10 h-10 relative"
          >
            <Image 
              src="/logo.svg"
              alt="LexOra Logo" 
              width={40}
              height={40}
              className="w-full h-full"
              priority
            />
          </motion.div>
          <div className="flex flex-col ml-1">
            <motion.span 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-500 font-bold text-2xl leading-tight tracking-tight"
            >
              LexOra
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs text-gray-600 dark:text-gray-300 font-medium tracking-wider"
            >
              Legal Advisor AI
            </motion.span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <div className="flex">
            {[
              { path: "/", label: "Home" },
              { path: "/articles", label: "Articles" },
              { path: "/assistant", label: "Legal Assistant" }
            ].map((item) => (
              <Link 
                key={item.path}
                href={item.path} 
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                  pathname === item.path 
                    ? "text-blue-700 dark:text-blue-400" 
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.label}
                {pathname === item.path && (
                  <motion.span 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 mx-2 bg-blue-600 dark:bg-blue-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                console.log("Toggling theme from", theme);
                toggleTheme();
              }}
              className={`rounded-full p-2.5 transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700 border-2 border-yellow-500'
                  : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border-2 border-blue-300'
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full p-2.5 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-800/70"
            >
              <UserIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </nav>
        
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              console.log("Mobile - Toggling theme from", theme);
              toggleTheme();
            }}
            className={`rounded-full p-2 transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 text-yellow-300 border-2 border-yellow-500'
                : 'bg-blue-50 text-blue-900 border-2 border-blue-300'
            }`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <MoonIcon className="h-4 w-4" />
            ) : (
              <SunIcon className="h-4 w-4" />
            )}
          </motion.button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <nav className="flex flex-col px-4 py-2">
              {[
                { path: "/", label: "Home" },
                { path: "/articles", label: "Articles" },
                { path: "/assistant", label: "Legal Assistant" }
              ].map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-4 text-sm font-medium border-l-2 ${
                    pathname === item.path 
                      ? "border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" 
                      : "border-transparent text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-2 pb-3 px-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                <Link 
                  href="#" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <UserIcon className="h-5 w-5 mr-3" />
                  <span>Account</span>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
