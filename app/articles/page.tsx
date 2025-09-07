"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpenIcon, 
  ClockIcon, 
  TagIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

// Sample data for IPC sections and laws - in a real application, this would come from an API or database
const articles = [
  {
    id: 1,
    title: "IPC Section 300: Murder",
    excerpt: "Except in the cases hereinafter excepted, culpable homicide is murder, if the act by which the death is caused is done with the intention of causing death.",
    lastUpdated: "Last amended in 2018",
    category: "Criminal Law",
    readTime: "5 min read",
    sectionNumber: "300",
    punishment: "Death or life imprisonment and fine"
  },
  {
    id: 2,
    title: "IPC Section 375: Rape",
    excerpt: "A man is said to commit rape when he has sexual intercourse with a woman under circumstances falling under any of the six following descriptions.",
    lastUpdated: "Last amended in 2021",
    category: "Criminal Law",
    readTime: "7 min read",
    sectionNumber: "375",
    punishment: "Rigorous imprisonment not less than ten years, which may extend to imprisonment for life, and fine"
  },
  {
    id: 3,
    title: "IPC Section 420: Cheating and dishonestly inducing delivery of property",
    excerpt: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person shall be punished.",
    lastUpdated: "Last amended in 2013",
    category: "Criminal Law",
    readTime: "4 min read",
    sectionNumber: "420",
    punishment: "Imprisonment up to 7 years and fine"
  },
  {
    id: 4,
    title: "IPC Section 499: Defamation",
    excerpt: "Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person.",
    lastUpdated: "Last amended in 2018",
    category: "Criminal Law",
    readTime: "6 min read",
    sectionNumber: "499",
    punishment: "Simple imprisonment for up to 2 years, or fine, or both"
  },
  {
    id: 5,
    title: "Right to Information Act, 2005",
    excerpt: "An Act to provide for setting out the practical regime of right to information for citizens to secure access to information under the control of public authorities.",
    lastUpdated: "Last amended in 2019",
    category: "Constitutional Law",
    readTime: "8 min read",
    sectionNumber: "N/A",
    punishment: "N/A"
  },
  {
    id: 6,
    title: "IPC Section 376: Punishment for rape",
    excerpt: "Whoever commits rape shall be punished with rigorous imprisonment of either description for a term which shall not be less than ten years.",
    lastUpdated: "Last amended in 2021",
    category: "Criminal Law",
    readTime: "5 min read",
    sectionNumber: "376",
    punishment: "Rigorous imprisonment not less than ten years, may extend to imprisonment for life, and fine"
  },
];

// Categories for filtering
const categories = [
  "All Categories",
  "Criminal Law",
  "Constitutional Law",
  "Family Law",
  "Property Law",
  "Corporate Law"
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
          Indian Law Reference
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore the Indian Penal Code (IPC) sections and other important Indian laws
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
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-300">No legal references found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you&apos;re looking for.</p>
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
                      <span className="font-semibold text-xs">{article.sectionNumber !== "N/A" ? "§" : "LAW"}</span>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {article.sectionNumber !== "N/A" ? `Section ${article.sectionNumber}` : "Act"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{article.lastUpdated}</p>
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
