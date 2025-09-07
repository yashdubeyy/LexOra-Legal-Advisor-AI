"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpenIcon, 
  ClockIcon, 
  UserIcon, 
  TagIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

// Sample article data - in a real application, this would come from an API or CMS
const articles = [
  {
    id: 1,
    title: "Understanding the Indian Penal Code: A Comprehensive Guide",
    excerpt: "An overview of the structure and key sections of the IPC that every Indian citizen should know about.",
    author: "Advocate Sharma",
    date: "August 15, 2025",
    category: "Criminal Law",
    readTime: "8 min read",
    image: "/document.jpg"
  },
  {
    id: 2,
    title: "Property Rights in India: What You Need to Know",
    excerpt: "A detailed analysis of property laws in India, covering ownership, transfer, and dispute resolution mechanisms.",
    author: "Advocate Patel",
    date: "July 28, 2025",
    category: "Property Law",
    readTime: "10 min read",
    image: "/document.jpg"
  },
  {
    id: 3,
    title: "Consumer Protection Act 2019: Key Changes and Impact",
    excerpt: "How the new Consumer Protection Act strengthens consumer rights and introduces modern regulatory mechanisms.",
    author: "Advocate Singh",
    date: "June 12, 2025",
    category: "Consumer Law",
    readTime: "7 min read",
    image: "/document.jpg"
  },
  {
    id: 4,
    title: "Digital Privacy Laws in India: Current Status and Future Outlook",
    excerpt: "An examination of India's approach to digital privacy, data protection, and the upcoming Personal Data Protection Bill.",
    author: "Advocate Reddy",
    date: "September 2, 2025",
    category: "Cyber Law",
    readTime: "12 min read",
    image: "/document.jpg"
  },
  {
    id: 5,
    title: "Employment Law Basics: Rights and Obligations",
    excerpt: "Essential information about employment contracts, workplace discrimination, and dispute resolution mechanisms.",
    author: "Advocate Khan",
    date: "August 20, 2025",
    category: "Labor Law",
    readTime: "9 min read",
    image: "/document.jpg"
  },
  {
    id: 6,
    title: "Intellectual Property Rights in the Digital Age",
    excerpt: "How Indian copyright, trademark and patent laws are evolving to address challenges in the digital economy.",
    author: "Advocate Joshi",
    date: "July 5, 2025",
    category: "Intellectual Property",
    readTime: "11 min read",
    image: "/document.jpg"
  },
];

// Categories for filtering
const categories = [
  "All Categories",
  "Criminal Law",
  "Property Law",
  "Consumer Law",
  "Cyber Law",
  "Labor Law",
  "Intellectual Property"
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Filter articles based on category and search query
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "All Categories" || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-300">
          Legal Knowledge Hub
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Stay informed with our collection of articles on Indian law, legal procedures, and rights
        </p>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-2/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <select
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-300">No articles found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <BookOpenIcon className="h-16 w-16 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="flex items-center">
                    <TagIcon className="h-4 w-4 mr-1" />
                    {article.category}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{article.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-800 dark:text-blue-200">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{article.author}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{article.date}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <nav className="inline-flex rounded-md shadow">
          <a href="#" className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded-l-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">Previous</a>
          <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">1</a>
          <a href="#" className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-t border-b border-gray-200 dark:border-gray-700">2</a>
          <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">3</a>
          <a href="#" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-r-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">Next</a>
        </nav>
      </div>
    </div>
  );
}
