import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ScaleIcon } from "@heroicons/react/24/outline";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LexOra | AI-powered legal advisor for Indian Law",
  description: "An intelligent legal assistant that analyzes cases, finds relevant IPC sections, searches for legal precedents, and drafts professional documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t py-8 bg-background">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="relative mr-2">
                      <ScaleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-amber-500 rounded-full"></span>
                    </div>
                    <div className="flex flex-col -space-y-1">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-600 font-bold text-lg">
                        LexOra
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        Legal Advisor AI
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-8 mb-4 md:mb-0 text-sm text-gray-600 dark:text-gray-400">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                    <Link href="/articles" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Articles</Link>
                    <Link href="/assistant" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Legal Assistant</Link>
                    <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} LexOra. All rights reserved.
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
