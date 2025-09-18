"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
// import { format } from "date-fns";

// Icons
import { 
  ScaleIcon, 
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
  BookOpenIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  // UserIcon,
  XCircleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  sections?: {
    title: string;
    content: string;
  }[];
}

interface ParsedSection {
  title: string;
  content: string;
}

export default function LegalAssistant() {
    // Removed unused userInput state
    const [messages, setMessages] = useState<Message[]>([]);
    const [, setResult] = useState(""); // result value not used directly in UI but setter is needed
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [apiStatus, setApiStatus] = useState({ isConnected: false, message: "Checking API connection..." });
    const [ipcSections, setIpcSections] = useState<Array<{section: string, title: string}>>([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<{ issue: string }>();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const checkApiHealth = async () => {
        try {
          const res = await fetch("http://localhost:5000/health");
          if (res.ok) {
            setApiStatus({ isConnected: true, message: "API connected successfully" });
            fetchIpcSections();
            
            // Add welcome message
            setMessages([{
              id: "welcome",
              type: "assistant",
              content: "Hello! I'm your AI-powered legal assistant specialized in Indian law. How can I help you today?",
              timestamp: new Date()
            }]);
          } else {
            setApiStatus({ isConnected: false, message: "API is running but returned an error" });
          }
        } catch {
          setApiStatus({ isConnected: false, message: "Could not connect to API. Please ensure the backend is running." });
        }
      };
      checkApiHealth();
    }, []);
    
    // For scroll-to-bottom button
    const [showScrollButton, setShowScrollButton] = useState(false);
    
    // Scroll to bottom whenever messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    // Check scroll position to show/hide scroll button
    useEffect(() => {
      const handleScroll = (e: Event) => {
        const target = e.target as HTMLDivElement;
        const isScrollable = target.scrollHeight > target.clientHeight;
        const isNotAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight > 100;
        setShowScrollButton(isScrollable && isNotAtBottom);
      };
      
      const chatArea = document.getElementById("chat-messages-area");
      if (chatArea) {
        chatArea.addEventListener("scroll", handleScroll);
        return () => chatArea.removeEventListener("scroll", handleScroll);
      }
    }, []);

    const fetchIpcSections = async () => {
      try {
        const res = await fetch("http://localhost:5000/ipc-sections");
        if (res.ok) {
          const data = await res.json();
          setIpcSections(data.sections || []);
        }
      } catch {
        console.error("Failed to fetch IPC sections");
      }
    };

    const onSubmit = async (data: { issue: string }) => {
      if (!data.issue.trim()) return;
      
      // Add user message to chat
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: "user",
        content: data.issue,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setLoading(true);
      setError("");
      reset({ issue: "" });
      
      try {
        const res = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_input: data.issue }),
        });
        
        const responseData = await res.json();
        
        if (res.ok) {
          setResult(responseData.result);
          
          // Add assistant message to chat
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            type: "assistant",
            content: responseData.result,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          setError(responseData.error || "Unknown error");
        }
      } catch {
        setError("Failed to connect to backend. Please ensure the API is running.");
      } finally {
        setLoading(false);
      }
    };
    
    const clearChat = () => {
      setMessages([{
        id: "welcome",
        type: "assistant",
        content: "Hello! I'm your AI-powered legal assistant specialized in Indian law. How can I help you today?",
        timestamp: new Date()
      }]);
      setResult("");
      setError("");
    };

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
    };

    const parseMessageContent = (content: string): ParsedSection[] => {
      if (!content.includes('##')) return [{ title: "", content }];
      
      const sections = content.split('##').map((section, i) => {
        if (i === 0) return null;
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        return { title, content };
      }).filter(Boolean) as ParsedSection[];
      
      return sections.length > 0 ? sections : [{ title: "", content }];
    };

    const renderChatMessage = (message: Message) => {
      const isAssistant = message.type === "assistant";
      const parsedContent = isAssistant ? parseMessageContent(message.content) : [];
      
      return (
        <motion.div 
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}
        >
          <div className={`flex max-w-[85%] ${!isAssistant && 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 h-11 w-11 rounded-full flex items-center justify-center ${
              isAssistant 
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md ring-2 ring-white dark:ring-gray-800' 
                : 'bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-blue-900 dark:to-indigo-900 shadow-md ring-2 ring-white dark:ring-gray-800'
            } ${!isAssistant ? 'ml-3' : 'mr-3'}`}>
              {isAssistant ? (
                <ScaleIcon className="h-6 w-6" />
              ) : (
                <div className="font-semibold text-blue-800 dark:text-blue-100">You</div>
              )}
            </div>
            
            <div className={`space-y-2 ${isAssistant ? 'mr-12' : 'ml-3 order-first'} flex-1`}>
              {isAssistant && parsedContent.length > 0 && parsedContent[0].title ? (
                parsedContent.map((section, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                  >
                    {section.title && (
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-md font-bold text-blue-900 dark:text-blue-300 flex items-center">
                          <DocumentTextIcon className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                          {section.title}
                        </h3>
                        <button 
                          onClick={() => copyToClipboard(section.content)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          title="Copy section"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`rounded-2xl px-5 py-4 ${
                  isAssistant 
                    ? 'bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
              )}
              
              <div className={`text-xs text-gray-500 flex items-center ${!isAssistant ? 'justify-end' : 'justify-start'}`}>
                <span className={`${!isAssistant ? 'order-last ml-1.5' : 'mr-1.5'} w-1.5 h-1.5 rounded-full ${isAssistant ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                {new Intl.DateTimeFormat('en-US', {
                  hour: 'numeric',
                  minute: 'numeric'
                }).format(message.timestamp)}
              </div>
            </div>
          </div>
        </motion.div>
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 dark:text-white">
        <div className="container mx-auto px-4 py-10">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-block">
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                className="inline-block bg-gradient-to-br from-blue-100 to-white dark:from-blue-900 dark:to-blue-950 p-4 rounded-2xl shadow-lg"
              >
                <ScaleIcon className="h-14 w-14 text-blue-800 dark:text-blue-400 mx-auto" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent">
              LexOra AI Legal Assistant
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your AI-powered legal companion for Indian law — analyze cases, find relevant IPC sections, and draft documents
            </p>
            <div className={`mt-5 text-sm inline-flex items-center px-4 py-1.5 rounded-full shadow-sm ${apiStatus.isConnected ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 dark:from-green-900 dark:to-green-800 dark:text-green-100' : 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 dark:from-red-900 dark:to-red-800 dark:text-red-100'}`}>
              <span className={`w-2.5 h-2.5 rounded-full mr-2 ${apiStatus.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              {apiStatus.message}
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="lg:col-span-8 space-y-5 md:space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-blue-100/50 dark:border-blue-800/30 backdrop-blur-sm relative">
                <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 p-5 md:p-6 flex items-center justify-between relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-md"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-md"></div>
                  <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-blue-400/20 rounded-full -translate-y-1/2 blur-md"></div>
                  
                  {/* Header content */}
                  <div className="flex items-center z-10 relative">
                    <motion.div 
                      whileHover={{ rotate: [0, -5, 10, -5, 0], scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white p-3 md:p-4 rounded-xl shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-blue-950 dark:to-blue-900"
                    >
                      <DocumentTextIcon className="h-6 w-6 md:h-7 md:w-7 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <h2 className="ml-4 md:ml-5 text-xl md:text-2xl font-bold text-white tracking-wide">Legal Consultation</h2>
                  </div>
                  
                  <div className="flex space-x-3 z-10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (messages.length > 0) {
                          const chatText = messages
                            .map(m => `${m.type === 'user' ? 'You' : 'Assistant'}: ${m.content}`)
                            .join('\n\n');
                          navigator.clipboard.writeText(chatText);
                          alert('Chat history copied to clipboard!');
                        }
                      }}
                      className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-colors shadow-md backdrop-blur-sm flex items-center gap-2"
                      title="Copy chat history"
                      disabled={messages.length === 0}
                    >
                      <DocumentDuplicateIcon className="h-5 w-5" />
                      <span className="hidden md:inline text-sm font-medium">Copy</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearChat}
                      className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-colors shadow-md backdrop-blur-sm flex items-center gap-2"
                      title="Clear chat"
                    >
                      <XCircleIcon className="h-5 w-5" />
                      <span className="hidden md:inline text-sm font-medium">Clear</span>
                    </motion.button>
                  </div>
                </div>

                {/* Chat messages area */}
                <div id="chat-messages-area" className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 h-96 md:h-[32rem] overflow-y-auto p-4 md:p-6 relative custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {messages.length > 0 ? (
                      <div key="messages-list" className="space-y-4">
                        {messages.map(message => renderChatMessage(message))}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <motion.div 
                        key="empty-state" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center"
                      >
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-blue-100/50 dark:border-blue-900/30 max-w-md w-full">
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 mb-6 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
                          >
                            <ScaleIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                          </motion.div>
                          <h3 className="text-lg font-medium text-center text-gray-800 dark:text-gray-200 mb-2">Your Legal Consultation</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Describe your legal issue or ask a question to get started with your AI legal assistant.</p>
                          <div className="text-sm text-gray-500 dark:text-gray-500 space-y-2 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <p className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span> 
                              Get insights on Indian Penal Code sections
                            </p>
                            <p className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              Find relevant legal precedents
                            </p>
                            <p className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              Receive guidance on legal procedures
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                    
                  {/* Scroll to bottom button in its own AnimatePresence */}
                  <AnimatePresence>
                    {showScrollButton && (
                      <motion.button
                        key="scroll-button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                        className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg z-10"
                        aria-label="Scroll to bottom"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                    
                  {/* Loading indicator */}
                  {loading && (
                    <motion.div 
                      key="loading-indicator"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center mt-4 max-w-[70%]"
                    >
                      <div className="flex-shrink-0 h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mr-3 shadow-md ring-2 ring-white dark:ring-gray-800">
                        <ScaleIcon className="h-6 w-6" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 shadow-md border border-blue-50 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="flex space-x-1">
                            <motion.div 
                              animate={{ 
                                y: [0, -8, 0],
                                opacity: [0.6, 1, 0.6]
                              }}
                              transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                repeatType: "loop",
                                times: [0, 0.5, 1],
                                ease: "easeInOut"
                              }}
                              className="w-2 h-2 rounded-full bg-blue-600"
                            />
                            <motion.div 
                              animate={{ 
                                y: [0, -8, 0],
                                opacity: [0.6, 1, 0.6]
                              }}
                              transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                repeatType: "loop",
                                times: [0, 0.5, 1],
                                delay: 0.15,
                                ease: "easeInOut"
                              }}
                              className="w-2 h-2 rounded-full bg-blue-600"
                            />
                            <motion.div 
                              animate={{ 
                                y: [0, -8, 0],
                                opacity: [0.6, 1, 0.6]
                              }}
                              transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                repeatType: "loop",
                                times: [0, 0.5, 1],
                                delay: 0.3,
                                ease: "easeInOut"
                              }}
                              className="w-2 h-2 rounded-full bg-blue-600"
                            />
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Analyzing your issue...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-5 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-850">
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <div className="relative">
                      <div className="absolute left-4 top-4 text-blue-500 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-3a1 1 0 00-1 1v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <textarea
                        {...register("issue", { required: "Please enter your query" })}
                        className="w-full p-4 pl-12 pr-14 border-2 border-blue-100 dark:border-blue-900/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition duration-200 dark:bg-gray-800 dark:text-white text-gray-800 shadow-lg"
                        placeholder="Describe your legal issue or ask a question..."
                        rows={2}
                        style={{ minHeight: "90px" }}
                      />
                      <div className="absolute right-3 bottom-3 flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.05, rotate: -10 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 dark:from-blue-500 dark:to-indigo-600 dark:hover:from-blue-600 dark:hover:to-indigo-700 text-white p-3.5 rounded-xl shadow-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-blue-500"
                          disabled={loading || !apiStatus.isConnected}
                        >
                          {loading ? (
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                          ) : (
                            <PaperAirplaneIcon className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                    
                    {errors.issue && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 ml-1 text-xs text-red-600 dark:text-red-400 flex items-center"
                      >
                        <ExclamationCircleIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        {errors.issue.message as string}
                      </motion.p>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between px-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {apiStatus.isConnected ? (
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            AI assistant ready
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                            Disconnected
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Ask any legal question about Indian law
                      </div>
                    </div>
                  </form>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="mt-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 flex items-start rounded-r-md"
                    >
                      <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
              className="lg:col-span-4 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-blue-100/50 dark:border-blue-800/30 backdrop-blur-sm relative">
                <div className="bg-gradient-to-r from-indigo-800 via-blue-700 to-blue-600 p-5 md:p-6 flex items-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-md"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-md"></div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: [0, -5, 10, -5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-white to-blue-50 dark:from-blue-950 dark:to-indigo-900 p-3 rounded-xl shadow-lg z-10"
                  >
                    <BookOpenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h2 className="ml-4 text-xl font-bold text-white z-10 tracking-wide">IPC Sections</h2>
                </div>
                <div className="p-5 md:p-6 bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-850">
                  <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {ipcSections.length > 0 ? (
                      <ul className="space-y-2">
                        {ipcSections.map((section, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="py-3 px-4 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 rounded-xl cursor-pointer transition-all flex items-center group border border-transparent hover:border-blue-200/70 dark:hover:border-blue-800/30 hover:shadow-md"
                            onClick={() => {
                              const textArea = document.querySelector('textarea');
                              if (textArea) {
                                textArea.value = `Tell me about IPC section ${section.section} - ${section.title}`;
                                textArea.focus();
                              }
                            }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/70 dark:to-indigo-900/50 rounded-lg flex items-center justify-center mr-3 text-blue-700 dark:text-blue-400 font-bold text-xs group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/70 dark:group-hover:to-indigo-800/50 transition-colors shadow-sm">
                              {section.section}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                Section {section.section}
                                <motion.span 
                                  initial={{ width: 0, opacity: 0 }}
                                  whileHover={{ width: 'auto', opacity: 1 }}
                                  className="ml-2 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md overflow-hidden whitespace-nowrap shadow-sm"
                                >
                                  Click to query
                                </motion.span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{section.title}</div>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 p-4">
                        {apiStatus.isConnected ? (
                          <>
                            <motion.div 
                              animate={{ 
                                rotate: [0, 360],
                                scale: [1, 1.05, 1]
                              }}
                              transition={{ 
                                rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                              }}
                              className="w-12 h-12 mb-4 text-blue-500 dark:text-blue-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </motion.div>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">Loading IPC sections...</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Retrieving relevant sections of Indian Penal Code</p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">API Not Connected</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Please check API connection to view IPC sections</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-blue-100/50 dark:border-blue-800/30 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 p-5 flex items-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-md"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-md"></div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: [0, -5, 10, -5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-white to-blue-50 dark:from-blue-950 dark:to-indigo-900 p-3 rounded-xl shadow-lg z-10"
                  >
                    <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h2 className="ml-4 text-xl font-bold text-white z-10 tracking-wide">How It Works</h2>
                </div>
                <div className="p-5 md:p-6 bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-850">
                  <ol className="space-y-4">
                    <motion.li 
                      className="flex items-start group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/70 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 font-bold rounded-lg w-8 h-8 flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/70 dark:group-hover:to-indigo-800/50 transition-all">1</span>
                      <span className="text-sm dark:text-gray-300 font-medium">Describe your legal issue in detail</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-start group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/70 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 font-bold rounded-lg w-8 h-8 flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/70 dark:group-hover:to-indigo-800/50 transition-all">2</span>
                      <span className="text-sm dark:text-gray-300 font-medium">AI analyzes case details and identifies legal matters</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-start group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/70 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 font-bold rounded-lg w-8 h-8 flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/70 dark:group-hover:to-indigo-800/50 transition-all">3</span>
                      <span className="text-sm dark:text-gray-300 font-medium">System finds relevant IPC sections</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-start group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/70 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 font-bold rounded-lg w-8 h-8 flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/70 dark:group-hover:to-indigo-800/50 transition-all">4</span>
                      <span className="text-sm dark:text-gray-300 font-medium">Matches with legal precedents and similar cases</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-start group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/70 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 font-bold rounded-lg w-8 h-8 flex items-center justify-center mr-3.5 flex-shrink-0 shadow-sm group-hover:shadow group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/70 dark:group-hover:to-indigo-800/50 transition-all">5</span>
                      <span className="text-sm dark:text-gray-300 font-medium">Generates appropriate legal documentation</span>
                    </motion.li>
                  </ol>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-900/30 dark:to-amber-800/20 rounded-xl border border-amber-100/80 dark:border-amber-800/30 shadow-sm hover:shadow-md transition-all"
                  >
                    <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start">
                      <ExclamationCircleIcon className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" />
                      This tool is for informational purposes only and does not constitute legal advice.
                    </p>
                  </motion.div>
                </div>
              </div>

              <motion.div 
                className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-xl shadow-lg p-5 text-white"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-bold text-xl mb-2">Need Professional Help?</h3>
                <p className="text-sm opacity-90 mb-4">
                  While our AI provides guidance, complex legal matters often require professional assistance.
                </p>
                <button className="bg-white text-blue-800 hover:bg-blue-50 transition-colors font-medium px-4 py-2 rounded-lg text-sm">
                  Find a Lawyer
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
  );
}
