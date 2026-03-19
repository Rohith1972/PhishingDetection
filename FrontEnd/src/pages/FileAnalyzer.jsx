import React, { useState, useRef } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileSearch, UploadCloud, FileType, Search, AlertTriangle, ShieldCheck, FileWarning, SearchX } from 'lucide-react'
import { UserEducation } from '@/components/shared/UserEducation'
import { RiskScore } from '@/components/shared/RiskScore'
import { motion, AnimatePresence } from 'framer-motion'

export function FileAnalyzer() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setResult(null)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    
    setLoading(true)
    setResult(null)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const res = await api.post('/scan/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const tLevel = res.data.threatLevel;
      let classification = 'Safe';
      let score = 5;
      if (tLevel === 'HIGH' || res.data.malicious) {
        classification = 'Malicious';
        score = 95;
      } else if (tLevel === 'MEDIUM') {
        classification = 'Suspicious';
        score = 65;
      }
      
      setResult({
        classification: classification,
        score: score,
        explanation: res.data.details,
        flags: tLevel === "HIGH" || res.data.malicious ? [
          { title: "Threat Detected", description: "The uploaded file has been flagged as malicious by VirusTotal / analysis." }
        ] : tLevel === "MEDIUM" ? [
          { title: "Suspicious File", description: "The uploaded file exhibits suspicious traits." }
        ] : []
      })

      if (tLevel === 'HIGH' || res.data.malicious) {
        window.dispatchEvent(new CustomEvent('security_alert', { 
          detail: { message: `Malware detected in uploaded file: ${file.name}` } 
        }));
      }
    } catch (err) {
      console.error(err)
      alert("File analysis failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 rounded-xl">
          <FileSearch className="w-8 h-8 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">File Analyzer</h1>
          <p className="text-muted-foreground mt-1">Upload documents, PDFs, or executables for deep malware scanning.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 flex flex-col">
          <Card className="glass-card shadow-xl h-full border-t-2 border-t-indigo-500/50">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                Upload File
              </CardTitle>
              <CardDescription>Drag & drop your file here, or click to browse</CardDescription>
            </CardHeader>
            <CardContent className="p-6 h-[calc(100%-80px)] flex flex-col justify-between">
              
              {!file ? (
                <div 
                  className={`border-2 border-dashed rounded-xl h-[300px] flex flex-col items-center justify-center transition-colors cursor-pointer group ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-border/60 hover:border-indigo-400 hover:bg-white/5'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileType className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Select a file to upload</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[250px] text-center">
                    Supported: PDF, DOCX, XLSX, EXE, ZIP
                  </p>
                  <p className="text-xs text-muted-foreground mt-4 opacity-50 uppercase tracking-wider font-semibold">Max Size: 50MB</p>
                </div>
              ) : (
                <div className="border border-border/60 rounded-xl h-[300px] flex flex-col items-center justify-center bg-background/30 p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                  <FileSearch className="w-16 h-16 text-indigo-400 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground truncate w-full max-w-[300px]" title={file.name}>{file.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown type'}
                  </p>
                  <div className="mt-8 flex gap-3 w-full justify-center">
                    <Button variant="outline" onClick={handleClear} className="w-32 bg-background/50 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30">
                      Remove
                    </Button>
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={loading}
                      className="w-40 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                    >
                      {loading ? 'Scanning...' : 'Start Scan'}
                    </Button>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:pt-0">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-card/20 text-muted-foreground p-10 text-center min-h-[400px]"
              >
                <SearchX className="w-12 h-12 mb-4 opacity-20" />
                <p>Waiting for file upload...</p>
                <p className="text-sm mt-2 opacity-60 max-w-xs">Scan files against our database of zero-day exploits and known malware signatures.</p>
              </motion.div>
            )}
            
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center rounded-xl bg-card/40 border border-white/5 p-10 text-center min-h-[400px]"
              >
                <div className="relative w-24 h-24 mb-8">
                  <svg className="absolute inset-0 w-full h-full text-indigo-500/20" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4" />
                  </svg>
                  <svg className="absolute inset-0 w-full h-full text-indigo-500 animate-spin" viewBox="0 0 100 100" fill="none">
                    <path d="M50 2 A 48 48 0 0 1 98 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <Search className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-medium text-indigo-400">Performing Deep Inspection...</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
                  Analyzing file heuristics, stripping metadata, and running sandbox simulations.
                </p>
              </motion.div>
            )}
            
            {result && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className={`glass-card border-t-4 ${result.classification === 'Malicious' ? 'border-t-red-500' : result.classification === 'Suspicious' ? 'border-t-orange-500' : 'border-t-green-500'}`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                      <RiskScore 
                        score={result.score} 
                        className="drop-shadow-lg scale-110" 
                        label={result.classification === 'Malicious' ? 'Critical Risk' : result.classification === 'Suspicious' ? 'Suspicious Risk' : 'Secure'}
                      />
                      
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Verdict</h3>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                          {result.classification === 'Malicious' ? (
                            <FileWarning className="w-8 h-8 text-red-500" />
                          ) : result.classification === 'Suspicious' ? (
                            <AlertTriangle className="w-8 h-8 text-orange-500" />
                          ) : (
                            <ShieldCheck className="w-8 h-8 text-green-500" />
                          )}
                          <span className={`text-3xl font-bold ${result.classification === 'Malicious' ? 'text-red-500' : result.classification === 'Suspicious' ? 'text-orange-500' : 'text-green-500'}`}>
                            {result.classification}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <h4 className="font-semibold mb-2">Detailed Analysis</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.explanation}
                      </p>
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
