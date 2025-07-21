import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout1C from './components/Layout1C'
import Login from './pages/Login'
import Dashboard1C from './pages/Dashboard1C'
import Orders1C from './pages/Orders1C'
import Products from './pages/Products'
import Analytics from './pages/Analytics'
import Finance from './pages/Finance'
import Advertising from './pages/Advertising'
import Settings1C from './pages/Settings1C'
import Marketplaces from './pages/Marketplaces'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <Layout1C>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard1C />} />
                    <Route path="/orders" element={<Orders1C />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/advertising" element={<Advertising />} />
                    <Route path="/marketplaces" element={<Marketplaces />} />
                    <Route path="/settings" element={<Settings1C />} />
                  </Routes>
                </Layout1C>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App