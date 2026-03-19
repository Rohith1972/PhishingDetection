import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldAlert, Info, AlertTriangle, LinkIcon } from 'lucide-react'

export function UserEducation({ flags = [] }) {
  return (
    <Card className="glass-card mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-primary" />
          Why is this suspicious?
        </CardTitle>
        <CardDescription>Review the red flags and learn how to protect yourself.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {flags.length > 0 ? (
          <ul className="space-y-3">
            {flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-3 bg-muted/30 p-3 rounded-md">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">{flag.title}</h4>
                  <p className="text-sm text-muted-foreground">{flag.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-md">
            <Info className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-sm">No obvious red flags detected. However, always remain cautious when providing personal information.</p>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-4">
          <h4 className="font-semibold text-sm mb-3">Common Phishing Tactics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-background/40 p-3 rounded-md border border-border flex flex-col items-center text-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
              <span className="text-xs font-medium">Urgency & Threats</span>
            </div>
            <div className="bg-background/40 p-3 rounded-md border border-border flex flex-col items-center text-center">
              <Info className="w-6 h-6 text-yellow-500 mb-2" />
              <span className="text-xs font-medium">Unknown Sender</span>
            </div>
            <div className="bg-background/40 p-3 rounded-md border border-border flex flex-col items-center text-center">
              <LinkIcon className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-xs font-medium">Suspicious Links</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
