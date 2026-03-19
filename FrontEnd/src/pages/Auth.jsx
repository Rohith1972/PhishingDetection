import React, { useState } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Shield, Mail, Lock, ArrowRight, Github, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('token', res.data.accessToken)
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/dashboard')
      } else {
        const inputName = name.trim() ? name.trim() : email.split('@')[0];
        let finalName = inputName;
        if (finalName.length < 3) {
            finalName = finalName + 'usr';
        }
        await api.post('/auth/register', { name: finalName, email, password })
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('token', res.data.accessToken)
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/dashboard')
      }
    } catch (err) {
      console.error("Auth error", err)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Authentication failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group">
          <Shield className="w-8 h-8 text-primary group-hover:shadow-[0_0_15px_#3b82f6] rounded-full transition-shadow" />
          <span className="text-xl font-bold font-sans tracking-tight">PhishGuard</span>
        </Link>
        <Card className="w-[500px] min-h-[500px] max-w-[95vw] sm:p-6 glass-card border-white/10 shadow-2xl backdrop-blur-xl flex flex-col justify-center">
          <CardHeader className="text-center pb-6 space-y-4">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isLogin 
                ? 'Enter your email to sign in to your Secure Dashboard' 
                : 'Enter your details below to create your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2 relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required={!isLogin} className="pl-12 h-12 text-sm bg-background/50 border-input shadow-inner" />
                </div>
              )}
              <div className="space-y-2 relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="pl-12 h-12 text-sm bg-background/50 border-input shadow-inner" />
              </div>
              <div className="space-y-2 relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="pl-12 h-12 text-sm bg-background/50 border-input shadow-inner" />
              </div>
              
              <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 group transition-all" disabled={loading}>
                {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Sign Up')}
                {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-background/40 hover:bg-accent hover:text-accent-foreground border-border h-12 text-sm transition-colors">
                <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="bg-background/40 hover:bg-accent hover:text-accent-foreground border-border h-12 text-sm transition-colors">
                <Github className="mr-2 h-5 w-5" />
                Github
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-base text-center text-muted-foreground w-full mt-2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)} 
                className="underline font-bold text-primary hover:text-primary/80 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
