"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";

// Icons
import { 
  ScaleIcon, 
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  BookOpenIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export default function LegalAssistant() {
    const [userInput, setUserInput] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [apiStatus, setApiStatus] = useState({ isConnected: false, message: "Checking API connection..." });
    const [ipcSections, setIpcSections] = useState<Array<{section: string, title: string}>>([]);
    const [activeTab, setActiveTab] = useState("issue");
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
      const checkApiHealth = async () => {
        try {
          const res = await fetch("http://localhost:5000/health");
          if (res.ok) {
            setApiStatus({ isConnected: true, message: "API connected successfully" });
            fetchIpcSections();
          } else {
            setApiStatus({ isConnected: false, message: "API is running but returned an error" });
          }
        } catch (_error) {
          setApiStatus({ isConnected: false, message: "Could not connect to API. Please ensure the backend is running." });
        }
      };
      checkApiHealth();
    }, []);

    const fetchIpcSections = async () => {
      try {
        const res = await fetch("http://localhost:5000/ipc-sections");
        if (res.ok) {
          const data = await res.json();
          setIpcSections(data.sections || []);
        }
      } catch (_error) {
        console.error("Failed to fetch IPC sections");
      }
    };

    const onSubmit = async (data: { issue: string }) => {
      setLoading(true);
      setError("");
      setResult("");
      try {
        const res = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_input: data.issue }),
        });
        const responseData = await res.json();
        if (res.ok) {
          setResult(responseData.result);
          setActiveTab("analysis");
        } else {
          setError(responseData.error || "Unknown error");
        }
      } catch (_error) {
        setError("Failed to connect to backend. Please ensure the API is running.");
      } finally {
        setLoading(false);
      }
    };

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    const renderParsedResult = (result: string) => {
      if (!result) return null;
      const sections = result.split('##').map((section, i) => {
        if (i === 0) return null;
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        return { title, content };
      }).filter(Boolean);
      return (
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300">{section.title}</h3>
                <button 
                  onClick={() => copyToClipboard(section.content)}
                  className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-300"
                  title="Copy section"
                >
                  <DocumentDuplicateIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{section.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      );
    };

    return (
      <div className="container mx-auto px-4 py-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              className="inline-block"
            >
              <ScaleIcon className="h-14 w-14 text-blue-800 dark:text-blue-400 mx-auto" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold mt-4 text-blue-900 dark:text-blue-300">
            AI Legal Assistant
          </h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your AI-powered legal companion for Indian law — analyze cases, find relevant IPC sections, and draft documents
          </p>
          <div className={`mt-3 text-sm inline-flex items-center px-3 py-1 rounded-full ${apiStatus.isConnected ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${apiStatus.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {apiStatus.message}
          </div>
        </motion.header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-900 dark:to-blue-800 p-6 flex items-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-full">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="ml-4 text-2xl font-bold text-white">Legal Consultation</h2>
              </div>
              <div className="p-6">
                <div className="flex border-b dark:border-gray-700 mb-4">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "issue" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"}`}
                    onClick={() => setActiveTab("issue")}
                  >
                    Issue Description
                  </button>
                  {result && (
                    <button
                      className={`px-4 py-2 text-sm font-medium ${activeTab === "analysis" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"}`}
                      onClick={() => setActiveTab("analysis")}
                    >
                      Analysis
                    </button>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {activeTab === "issue" ? (
                    <motion.div
                      key="issue"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <textarea
                            {...register("issue", { required: "Please describe your legal issue" })}
                            className="w-full h-64 p-4 border dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Describe your legal issue in detail. For example: 'My neighbor has built a structure that extends onto my property despite multiple requests to remove it. This has been ongoing for 3 months and is affecting my property value and usage rights...'"
                            defaultValue={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                          />
                          {errors.issue && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                              <ExclamationCircleIcon className="w-4 h-4 inline mr-1" />
                              {errors.issue.message}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md flex items-center space-x-2 transition-colors"
                            disabled={loading || !apiStatus.isConnected}
                          >
                            {loading ? (
                              <span>Analyzing...</span>
                            ) : (
                              <>
                                <LightBulbIcon className="w-5 h-5" />
                                <span>Analyze Legal Issue</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 flex items-start"
                          >
                            <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                            </div>
                          </motion.div>
                        )}
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-auto"
                    >
                      {renderParsedResult(result)}
                      <div className="flex justify-between mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab("issue")}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
                        >
                          ← Back to Issue
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => copyToClipboard(result)}
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                          <DocumentDuplicateIcon className="w-5 h-5" />
                          <span>Copy Full Analysis</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-800 dark:to-blue-700 p-4 flex items-center">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                  <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="ml-3 text-lg font-bold text-white">IPC Sections</h2>
              </div>
              <div className="p-4">
                <div className="max-h-60 overflow-y-auto">
                  {ipcSections.length > 0 ? (
                    <ul className="divide-y dark:divide-gray-700">
                      {ipcSections.map((section, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="py-2"
                        >
                          <p className="font-medium text-blue-900 dark:text-blue-300">{section.section}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{section.title}</p>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400">
                      {apiStatus.isConnected ? "Loading IPC sections..." : "Connect to API to view IPC sections"}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-800 dark:to-blue-700 p-4 flex items-center">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                  <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="ml-3 text-lg font-bold text-white">How It Works</h2>
              </div>
              <div className="p-4">
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    <span className="text-sm dark:text-gray-300">Describe your legal issue in detail</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    <span className="text-sm dark:text-gray-300">AI analyzes case details and identifies legal matters</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    <span className="text-sm dark:text-gray-300">System finds relevant IPC sections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    <span className="text-sm dark:text-gray-300">Matches with legal precedents and similar cases</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</span>
                    <span className="text-sm dark:text-gray-300">Generates appropriate legal documentation</span>
                  </li>
                </ol>
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-100 dark:border-amber-800">
                  <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start">
                    <ExclamationCircleIcon className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                    This tool is for informational purposes only and does not constitute legal advice.
                  </p>
                </div>
              </div>
            </div>
            <motion.div 
              className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-900 dark:to-blue-700 rounded-xl shadow-lg p-5 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="font-bold text-xl mb-2">Need Professional Help?</h3>
              <p className="text-sm opacity-90 mb-4">
                While our AI provides guidance, complex legal matters often require professional assistance.
              </p>
              <button className="bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors font-medium px-4 py-2 rounded-lg text-sm">
                Find a Lawyer
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
}
