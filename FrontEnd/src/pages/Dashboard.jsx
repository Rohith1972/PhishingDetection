import React, { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LinkIcon, ShieldAlert, ShieldCheck, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const [data, setData] = useState({
    totalScans: 0,
    threatsDetected: 0,
    safeResults: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 }
  })
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard')
        setData(res.data)
        const histRes = await api.get('/history?page=0&size=5')
        setHistory(histRes.data.content || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchDashboard()
  }, [])

  const stats = [
    { title: "Total Scans", value: data.totalScans, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Threats Detected", value: data.threatsDetected, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
    { title: "Safe Results", value: data.safeResults, icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor your security scans and threat detection activity.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/url-scanner">
            <Button className="shadow-lg shadow-primary/20">New Scan</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card hover:-translate-y-1 transition-transform duration-300">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border/50 hover:bg-accent/40 transition-colors">
                  <div className="flex items-center gap-4 truncate max-w-[60%]">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border">
                      {scan.type === 'URL' ? <LinkIcon className="w-4 h-4 text-primary" /> : <ShieldAlert className="w-4 h-4 text-purple-500" />}
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-sm truncate">{scan.input || scan.url}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(scan.createdAt).toLocaleString()} • {scan.type}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      scan.riskLevel === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      scan.riskLevel === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                      'bg-green-500/10 text-green-500 border-green-500/20'
                    }`}>
                      {scan.riskLevel} Risk
                    </span>
                  </div>
                </div>
              ))}
              {history.length === 0 && <p className="text-muted-foreground text-sm p-4 text-center">No recent history.</p>}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-center">
              <Link to="/history" className="text-sm text-primary hover:underline">View all history</Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Risk Chart</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 h-[300px]">
            {/* Visual placeholder for a donut chart */}
            <div className="relative w-48 h-48 rounded-full border-[16px] border-card bg-transparent shadow-inner flex items-center justify-center"
                 style={{
                   background: 'conic-gradient(from 0deg, #22c55e 0% 70%, #ef4444 70% 90%, #eab308 90% 100%)',
                   clipPath: 'circle(50% at 50% 50%)',
                   margin: "-16px"
                 }}>
              <div className="absolute w-32 h-32 bg-background rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-bold">{data.totalScans}</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-xs">Low ({data.totalScans ? Math.round((data.riskDistribution.low / data.totalScans)*100) : 0}%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs">High ({data.totalScans ? Math.round((data.riskDistribution.high / data.totalScans)*100) : 0}%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-xs">Med ({data.totalScans ? Math.round((data.riskDistribution.medium / data.totalScans)*100) : 0}%)</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
