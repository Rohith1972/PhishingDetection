import React, { useState } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Mail, Search, AlertTriangle, CheckCircle2, MessageSquareText, Smartphone } from 'lucide-react'
import { UserEducation } from '@/components/shared/UserEducation'
import { motion, AnimatePresence } from 'framer-motion'

export function EmailAnalyzer() {
  const [activeTab, setActiveTab] = useState('email')
  const [content, setContent] = useState('')
  const [senderUrl, setSenderUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!content) return
    
    setLoading(true)
    setResult(null)
    
    try {
      const res = await api.post('/scan/message', { message: content })
      const isPhish = res.data.classification === "PHISHING"
      const classification = res.data.classification === "PHISHING" ? "Phishing" : "Safe";
      setResult({
        classification: classification,
        confidence: res.data.riskScore,
        explanation: res.data.explanation,
        flags: res.data.highlightedText.map(t => ({
          title: "Suspicious Keyword",
          description: `The phrase "${t}" is commonly used in social engineering attacks.`
        }))
      })

      if (classification === "Phishing" || res.data.riskScore > 60) {
         window.dispatchEvent(new CustomEvent('security_alert', { 
           detail: { message: `Phishing pattern caught in ${activeTab === 'email' ? 'Email' : 'SMS'} scanner` } 
         }));
      }
    } catch (err) {
      console.error(err)
      alert("Analysis failed. Try logging in.")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (val) => {
    setActiveTab(val)
    setContent('')
    setSenderUrl('')
    setResult(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <MessageSquareText className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Message & Email Analyzer</h1>
          <p className="text-muted-foreground mt-1">Paste your suspicious emails or SMS texts for deep AI analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 flex flex-col">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email" className="flex gap-2"><Mail className="w-4 h-4"/> Email</TabsTrigger>
              <TabsTrigger value="sms" className="flex gap-2"><Smartphone className="w-4 h-4"/> Text / SMS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="mt-0">
              <Card className="glass-card shadow-xl h-full border-t-2 border-t-blue-500/50">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-lg">Email Header & Body</CardTitle>
                  <CardDescription>Paste the full email raw content below</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Input 
                    placeholder="Sender Email (optional)" 
                    value={senderUrl}
                    onChange={(e) => setSenderUrl(e.target.value)}
                    className="mb-4 bg-background/50 border-white/10"
                  />
                  <Textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Subject: Urgent Action Required...&#10;&#10;Dear Customer, please verify..." 
                    className="min-h-[290px] resize-none text-base bg-background/50 border-white/10 focus-visible:ring-blue-500/50"
                  />
                  <AnalyzeButton loading={loading} content={content} onClick={handleAnalyze} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sms" className="mt-0">
              <Card className="glass-card shadow-xl h-full border-t-2 border-t-purple-500/50">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-lg">Text Message Content</CardTitle>
                  <CardDescription>Copy and paste the SMS/WhatsApp message</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Input 
                    placeholder="Sender Number/Name (optional)" 
                    value={senderUrl}
                    onChange={(e) => setSenderUrl(e.target.value)}
                    className="mb-4 bg-background/50 border-white/10"
                  />
                  <Textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type or paste text message here... e.g., 'USPS: Your package is delayed. Click here to update.'" 
                    className="min-h-[290px] resize-none text-base bg-background/50 border-white/10 focus-visible:ring-purple-500/50"
                  />
                  <AnalyzeButton loading={loading} content={content} onClick={handleAnalyze} isSms />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:pt-14">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/20 text-muted-foreground p-10 text-center min-h-[400px]"
              >
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>Awaiting analysis...</p>
                <p className="text-sm mt-2 opacity-60 max-w-xs">Paste content on the left and click analyze to see AI insights.</p>
              </motion.div>
            )}
            
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center rounded-xl bg-card/40 border border-white/5 p-10 text-center min-h-[400px]"
              >
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  {activeTab === 'email' ? <Mail className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" /> : <Smartphone className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />}
                </div>
                <h3 className="text-lg font-medium text-primary">Processing with PhishGuard AI...</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">Extracting entities, checking sentiment, and matching against threat intelligence.</p>
              </motion.div>
            )}
            
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className={`glass-card border-t-4 ${result.classification === 'Phishing' ? 'border-t-red-500' : 'border-t-green-500'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Verdict</h3>
                        <div className="flex items-center gap-3 mt-2">
                          {result.classification === 'Phishing' ? (
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                          ) : (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                          )}
                          <span className={`text-3xl font-bold ${result.classification === 'Phishing' ? 'text-red-500' : 'text-green-500'}`}>
                            {result.classification}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Confidence</h3>
                        <span className="text-3xl font-bold">{result.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="font-semibold mb-2">Explanation</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <UserEducation flags={result.flags} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function AnalyzeButton({ loading, content, onClick, isSms }) {
  return (
    <Button 
      onClick={onClick} 
      disabled={loading || !content} 
      className={`w-full mt-6 h-12 text-md font-semibold ${isSms ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'} shadow-lg`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> 
          Analyzing...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Search className="w-5 h-5" /> 
          Analyze {isSms ? 'Text Message' : 'Email'}
        </span>
      )}
    </Button>
  )
}

