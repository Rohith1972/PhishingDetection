import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Link as LinkIcon, Mail, MessageSquare, History, Shield, FileSearch } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const location = useLocation();
  const [user, setUser] = React.useState({ name: 'User', email: 'user@example.com' });

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedNodeUser = JSON.parse(storedUser);
        setUser({ name: parsedNodeUser.name || 'User', email: parsedNodeUser.email || '' });
      } catch (e) {
        // ignore
      }
    }
  }, []);
  
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'URL Scanner', icon: LinkIcon, path: '/url-scanner' },
    { label: 'Message Analyzer', icon: Mail, path: '/email-analyzer' },
    { label: 'File Analyzer', icon: FileSearch, path: '/file-analyzer' },
    { label: 'Chat Assistant', icon: MessageSquare, path: '/ai-chat' },
    { label: 'History', icon: History, path: '/history' },
  ]

  return (
    <div className="w-64 h-screen border-r border-border bg-card/50 flex flex-col backdrop-blur-md hidden md:flex sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary shadow-primary/20" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          PhishGuard
        </span>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-4">Menu</div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-foreground")} />
                {item.label}
              </div>
            </Link>
          )
        })}
      </div>
      
      <div className="p-6 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/40 cursor-pointer hover:bg-accent transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate w-32">{user.name}</span>
            <span className="text-xs text-muted-foreground text-ellipsis overflow-hidden w-32">{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
