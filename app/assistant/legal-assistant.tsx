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
          <div className={`flex max-w-[80%] ${!isAssistant && 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
              isAssistant ? 'bg-blue-600 text-white' : 'bg-blue-100'
            } ${!isAssistant ? 'ml-3' : 'mr-3'}`}>
              {isAssistant ? (
                <ScaleIcon className="h-6 w-6" />
              ) : (
                <div className="font-semibold text-blue-700">You</div>
              )}
            </div>
            
            <div className={`space-y-1 ${isAssistant ? 'mr-12' : 'ml-3 order-first'}`}>
              {isAssistant && parsedContent.length > 0 && parsedContent[0].title ? (
                parsedContent.map((section, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    {section.title && (
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-md font-bold text-blue-900 dark:text-blue-300">{section.title}</h3>
                        <button 
                          onClick={() => copyToClipboard(section.content)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                          title="Copy section"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-sm">{section.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`rounded-2xl p-4 ${
                  isAssistant 
                    ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700' 
                    : 'bg-blue-600 text-white'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{isAssistant ? message.content : message.content}</p>
                </div>
              )}
              
              <div className={`text-xs text-gray-500 ${!isAssistant && 'text-right'}`}>
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
        <div className="container mx-auto px-4 py-10">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
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
            <h1 className="text-4xl md:text-5xl font-bold mt-4 text-blue-900 dark:text-blue-300">
              LexOra AI Legal Assistant
            </h1>
            <p className="mt-3 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your AI-powered legal companion for Indian law — analyze cases, find relevant IPC sections, and draft documents
            </p>
            <div className={`mt-3 text-sm inline-flex items-center px-3 py-1 rounded-full ${apiStatus.isConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${apiStatus.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {apiStatus.message}
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-8 space-y-4 md:space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-4 md:p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white p-2 md:p-3 rounded-full">
                      <DocumentTextIcon className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                    </div>
                    <h2 className="ml-3 md:ml-4 text-xl md:text-2xl font-bold text-white">Legal Consultation</h2>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (messages.length > 0) {
                          const chatText = messages
                            .map(m => `${m.type === 'user' ? 'You' : 'Assistant'}: ${m.content}`)
                            .join('\n\n');
                          navigator.clipboard.writeText(chatText);
                          alert('Chat history copied to clipboard!');
                        }
                      }}
                      className="text-white bg-blue-700 hover:bg-blue-800 rounded-full p-2 transition-colors"
                      title="Copy chat history"
                      disabled={messages.length === 0}
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={clearChat}
                      className="text-white bg-blue-700 hover:bg-blue-800 rounded-full p-2 transition-colors"
                      title="Clear chat"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Chat messages area */}
                <div id="chat-messages-area" className="bg-gray-50 dark:bg-gray-900 h-96 md:h-[32rem] overflow-y-auto p-4 md:p-6 relative">
                  <AnimatePresence mode="wait">
                    {messages.length > 0 ? (
                      <div key="messages-list" className="space-y-4">
                        {messages.map(message => renderChatMessage(message))}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div key="empty-state" className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="w-16 h-16 mb-4 opacity-50">
                          <ScaleIcon className="w-full h-full" />
                        </div>
                        <p>No messages yet. Start a conversation!</p>
                      </div>
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center mt-4"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                        <ScaleIcon className="h-6 w-6" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                        <div className="flex space-x-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Analyzing your issue...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                  <form onSubmit={handleSubmit(onSubmit)} className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        {...register("issue", { required: "Please enter your query" })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Describe your legal issue or ask a question..."
                        rows={2}
                      />
                      {errors.issue && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          <ExclamationCircleIcon className="w-3 h-3 inline mr-1" />
                          {errors.issue.message as string}
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-3 rounded-full shadow-md flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || !apiStatus.isConnected}
                    >
                      {loading ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      ) : (
                        <PaperAirplaneIcon className="w-5 h-5" />
                      )}
                    </motion.button>
                  </form>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 flex items-start rounded-r-md"
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
              className="lg:col-span-4 space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 flex items-center">
                  <div className="bg-white p-2 rounded-full">
                    <BookOpenIcon className="h-6 w-6 text-blue-600" />
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
                            className="py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 -mx-2 rounded cursor-pointer transition-colors"
                            onClick={() => {
                              const textArea = document.querySelector('textarea');
                              if (textArea) {
                                textArea.value = `Tell me about IPC section ${section.section} - ${section.title}`;
                                textArea.focus();
                              }
                            }}
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
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 flex items-center">
                  <div className="bg-white p-2 rounded-full">
                    <InformationCircleIcon className="h-6 w-6 text-blue-600" />
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
