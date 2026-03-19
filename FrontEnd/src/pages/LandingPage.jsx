import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, ArrowRight, LinkIcon, Mail, MessageSquare, Activity, User, FileSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ThemeToggle } from '@/components/theme-toggle'

export function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  }

  const features = [
    { icon: LinkIcon, title: "URL Scanner", desc: "Instantly check links for malicious intent and phishing red flags." },
    { icon: Mail, title: "Message Analyzer", desc: "Analyze suspicious emails and SMS messages using advanced AI models." },
    { icon: FileSearch, title: "File Analyzer", desc: "Scan documents and executables securely for zero-day malware." },
    { icon: MessageSquare, title: "AI Chat Assistant", desc: "Ask our AI assistant about cyber threats in real-time." },
    { icon: Activity, title: "Risk Scoring", desc: "Get comprehensive threat scores and detailed explanations." }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10 h-screen" />
      
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-12 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary shadow-primary/20" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            PhishGuard AI
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <ThemeToggle />
          <Button variant="ghost" className="hover:bg-white/5" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            Features
          </Button>
          <Button variant="ghost" className="hover:bg-white/5" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            How it works
          </Button>
          <Link to="/auth">
            <Button variant="ghost" className="hover:bg-white/5">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button className="font-semibold shadow-lg shadow-primary/20">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-4">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New: GPT-4 Powered Phishing Detection
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Detect Phishing <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-500">Instantly with AI</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Protect yourself from scams using advanced machine learning models trained on millions of cyber threats.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-primary/20 group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Architecture Flow Graphic */}
        <motion.div 
          id="how-it-works"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-24 max-w-5xl w-full"
        >
          <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                  <User className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">User Input</span>
              </div>
              
              <div className="flex-1 flex items-center justify-center relative h-10 w-full md:w-auto">
                <div className="absolute left-0 w-full h-px bg-gradient-to-r from-blue-500/50 via-primary/50 to-purple-500/50 hidden md:block" />
                <motion.div 
                  initial={{ left: "0%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#3b82f6] hidden md:block"
                />
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg relative">
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-pulse"></div>
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">PhishGuard AI</span>
              </div>

              <div className="flex-1 flex items-center justify-center relative h-10 w-full md:w-auto">
                <div className="absolute left-0 w-full h-px bg-gradient-to-r from-primary/50 via-red-500/50 to-green-500/50 hidden md:block" />
                <motion.div 
                  initial={{ left: "0%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 1 }}
                  className="absolute w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] hidden md:block"
                />
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Results</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div id="features" className="w-full max-w-6xl mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to stay safe online.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-card/40 border-white/5 backdrop-blur-sm hover:bg-card/60 transition-colors h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="h-24 border-t border-white/5 flex items-center justify-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PhishGuard AI. All rights reserved.
      </footer>
    </div>
  )
}
