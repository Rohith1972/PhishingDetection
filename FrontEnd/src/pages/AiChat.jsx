import React, { useState, useRef, useEffect } from 'react'
import api from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function AiChat() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am PhishGuard AI. You can ask me anything about cybersecurity, suspicious links, or how to protect your accounts.' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsTyping(true)

    try {
      const res = await api.post('/chat', { message: userMsg })
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: res.data.reply
      }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I am having trouble connecting to the server. Let's try again." }])
    } finally {
      setIsTyping(false)
    }
  }

  const suggestedPrompts = [
    "Is it safe to open a PDF from an unknown sender?",
    "How to spot a fake login page?",
    "What is spear phishing?"
  ]

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pt-2 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">PhishGuard Security Assistant</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block shadow-[0_0_5px_#22c55e]"></span> Online and ready to help</p>
        </div>
      </div>

      <Card className="glass-card flex-1 flex flex-col overflow-hidden border-white/10 shadow-2xl">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
            >
              <div className={cn("flex max-w-[85%] sm:max-w-[75%] items-start gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 border",
                  msg.role === 'user' ? "bg-accent border-white/10" : "bg-primary/20 border-primary/30"
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-foreground" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed text-left space-y-2",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-muted/50 border border-border text-foreground rounded-tl-sm backdrop-blur-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex max-w-[85%]">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center mt-1 border border-primary/30">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="px-4 py-4 rounded-2xl bg-muted/50 border border-border rounded-tl-sm flex items-center gap-1.5 h-[42px]">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full typing-dot"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full typing-dot"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full typing-dot"></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-background/50 border-t border-border backdrop-blur-md">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedPrompts.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="text-xs bg-card hover:bg-accent border border-white/5 px-3 py-1.5 rounded-full transition-colors flex items-center gap-2 group"
                >
                  <Sparkles className="w-3 h-3 text-primary group-hover:animate-pulse" />
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <div className="relative flex items-center">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about a suspicious email or cyber threats..." 
              className="pr-12 h-14 bg-card/50 border-white/10 focus-visible:ring-primary shadow-inner rounded-xl"
            />
            <Button 
              disabled={!input.trim() || isTyping}
              size="icon" 
              onClick={handleSend}
              className="absolute right-2 h-10 w-10 bg-primary hover:bg-primary/90 rounded-lg group"
            >
              <Send className="w-4 h-4 text-primary-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
