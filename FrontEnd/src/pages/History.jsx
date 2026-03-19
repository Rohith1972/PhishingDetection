import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Filter, Search, MoreVertical, Link as LinkIcon, Mail, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function History() {
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [historyData, setHistoryData] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const riskQ = filter === 'All' ? '' : `&riskLevel=${filter}`
        const res = await api.get(`/history?page=0&size=50${riskQ}`)
        setHistoryData(res.data.content || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchHistory()
  }, [filter])

  useEffect(() => {
    const search = searchParams.get('search')
    if (search !== null) {
      setSearchQuery(search)
    }
  }, [searchParams])

  const filteredData = historyData.filter(item => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.input && item.input.toLowerCase().includes(query)) ||
      (item.type && item.type.toLowerCase().includes(query)) ||
      (item.riskLevel && item.riskLevel.toLowerCase().includes(query))
    );
  });

  const handleDownload = () => {
    if (filteredData.length === 0) return;
    const headers = ['Target/Input', 'Type', 'Date', 'Risk Score', 'Risk Level'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => 
        `"${item.input.replace(/"/g, '""')}","${item.type}","${new Date(item.createdAt).toLocaleString()}","${item.riskScore}","${item.riskLevel}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'phishguard_user_history.csv';
    link.click();
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Scan History</h1>
          <p className="text-sm text-muted-foreground mt-1">Review your past scans and reports.</p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records..." 
              className="pl-9 h-10 w-full bg-background/50 border-input" 
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-background/50 border-input">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handleDownload} className="shrink-0 bg-background/50 border-input flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save History</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {['All', 'High', 'Medium', 'Low'].map(f => (
          <Badge 
            key={f} 
            variant={filter === f ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-1.5 text-sm shrink-0 transition-all hover:scale-105 active:scale-95"
            onClick={() => setFilter(f)}
          >
            {f === 'All' ? 'All Records' : `${f} Risk`}
          </Badge>
        ))}
      </div>

      <Card className="glass-card shadow-lg border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Target / Input</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Risk Score</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-accent/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground max-w-xs truncate">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.riskLevel === 'HIGH' ? 'bg-red-500/10' : item.riskLevel === 'MEDIUM' ? 'bg-yellow-500/10' : 'bg-green-500/10'
                      }`}>
                        {item.type === 'URL' ? <LinkIcon className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </div>
                      <span className="truncate">{item.input}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{item.type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        item.riskLevel === 'HIGH' ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : item.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></span>
                      <span className="font-semibold">{item.riskScore}/100</span>
                      <span className="text-muted-foreground text-xs">({item.riskLevel})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                    No records found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
