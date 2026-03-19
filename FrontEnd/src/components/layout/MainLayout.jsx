import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Bell, Menu, Search, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/theme-toggle'

export function MainLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'User', email: '' });
  
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const handleSecurityAlert = (e) => {
      setNotifications(prev => [
        { id: Date.now(), text: e.detail.message, time: "Just now", unread: true },
        ...prev
      ]);
    };
    window.addEventListener('security_alert', handleSecurityAlert);
    return () => window.removeEventListener('security_alert', handleSecurityAlert);
  }, []);

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  }

  const handleClearNotifications = (e) => {
    e.stopPropagation();
    setNotifications([]);
  }

  const handleReadNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card/40 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden md:flex items-center">
              <h2 className="text-lg font-semibold text-foreground/90 tracking-tight ml-2">
                Welcome to PhishGuard AI, <span className="text-primary">{user.name}</span>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                  <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 glass-card border-white/10 mt-2">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                  <DropdownMenuLabel className="font-semibold text-lg py-0">Notifications</DropdownMenuLabel>
                  <button onClick={handleClearNotifications} className="text-xs text-primary hover:text-primary/70 transition-colors font-medium">Mark all as read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleReadNotification(n.id)}
                      className="flex flex-col items-start px-4 py-3 hover:bg-white/5 transition-colors gap-1 border-b border-white/5 last:border-0 relative cursor-pointer group/item"
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className={`text-sm ${n.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>{n.text}</span>
                        {n.unread && <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5 shadow-[0_0_8px_#3b82f6]"></span>}
                      </div>
                      <span className="text-xs text-muted-foreground">{n.time}</span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden md:flex gap-2 border-border bg-background/50 hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card border-white/10 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="cursor-pointer focus:bg-white/5">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-white/5">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gradient-to-br from-background to-secondary/20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
