import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { Auth } from './pages/Auth'
import { MainLayout } from './components/layout/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { UrlScanner } from './pages/UrlScanner'
import { EmailAnalyzer } from './pages/EmailAnalyzer'
import { AiChat } from './pages/AiChat'
import { History } from './pages/History'
import { FileAnalyzer } from './pages/FileAnalyzer'
import { ThemeProvider } from './components/theme-provider'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/url-scanner" element={<UrlScanner />} />
          <Route path="/email-analyzer" element={<EmailAnalyzer />} />
          <Route path="/file-analyzer" element={<FileAnalyzer />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/history" element={<History />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
