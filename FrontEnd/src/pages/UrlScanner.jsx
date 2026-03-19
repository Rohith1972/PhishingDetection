import React, { useState } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LinkIcon, Loader2, ShieldCheck, ShieldAlert, Copy, Share } from 'lucide-react'
import { RiskScore } from '@/components/shared/RiskScore'
import { UserEducation } from '@/components/shared/UserEducation'
import { motion, AnimatePresence } from 'framer-motion'

export function UrlScanner() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleScan = async (e) => {
    e.preventDefault()
    if (!url) return
    
    setLoading(true)
    setResult(null)
    
    try {
      const res = await api.post('/scan/url', { url })
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      setResult({
        score: res.data.riskScore,
        status: res.data.status,
        domain: domain,
        explanation: res.data.explanation,
        flags: res.data.flags.map(f => ({
          title: f,
          description: 'Flagged by AI threat intelligence heuristics.'
        }))
      })

      if (res.data.status === 'HIGH_RISK' || res.data.status === 'Phishing' || res.data.riskScore > 60) {
        window.dispatchEvent(new CustomEvent('security_alert', { 
          detail: { message: `High-risk URL flagged: ${domain}` } 
        }));
      }
    } catch (err) {
      console.error('Scan Error', err)
      alert("Scan failed. Are you logged in?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold">URL Scanner</h1>
        <p className="text-muted-foreground mt-2">Analyze any link for malicious intent and tracking components.</p>
      </div>

      <Card className="glass-card overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-primary to-purple-500"></div>
        <CardContent className="p-6 sm:p-10">
          <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/login" 
                className="pl-12 h-14 text-lg bg-background/50 border-input shadow-inner focus-visible:ring-primary/50"
              />
            </div>
            <Button type="submit" disabled={loading || !url} className="h-14 px-8 text-lg min-w-[160px] shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Scan URL'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="glass-card md:col-span-1 border-t-4 border-t-primary flex flex-col items-center justify-center p-8 text-center"
                  style={{ borderTopColor: result.score > 70 ? '#ef4444' : result.score > 30 ? '#eab308' : '#22c55e' }}>
              <RiskScore score={result.score} className="mb-4 drop-shadow-lg" />
              <div className="mt-4 flex flex-col items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${
                  result.status === 'HIGH_RISK' || result.status === 'Phishing' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {result.status === 'HIGH_RISK' || result.status === 'Phishing' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {result.status}
                </span>
                <p className="text-xs text-muted-foreground mt-2">Domain: {result.domain}</p>
              </div>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card shadow-lg flex flex-col p-6">
                 <h3 className="font-bold flex items-center gap-2 mb-2"><ShieldAlert className="w-5 h-5 text-primary"/> AI Analysis & Explanation</h3>
                 <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
              </Card>
              <UserEducation flags={result.flags} />
              
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 bg-background/40 hover:bg-background/60">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Result
                </Button>
                <Button variant="outline" className="flex-1 bg-background/40 hover:bg-background/60">
                  <Share className="w-4 h-4 mr-2" />
                  Share Report
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
