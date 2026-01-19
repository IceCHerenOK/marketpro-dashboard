import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Sales from './pages/Sales'
import Products from './pages/Products'
import Prices from './pages/Prices'
import Stocks from './pages/Stocks'
import Analytics from './pages/Analytics'
import Finance from './pages/Finance'
import Advertising from './pages/Advertising'
import Settings from './pages/Settings'
import Marketplaces from './pages/Marketplaces'
import KnowledgeBase from './pages/KnowledgeBase'

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
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="sales" element={<Sales />} />
            <Route path="products" element={<Products />} />
            <Route path="prices" element={<Prices />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="finance" element={<Finance />} />
            <Route path="advertising" element={<Advertising />} />
            <Route path="marketplaces" element={<Marketplaces />} />
            <Route path="settings" element={<Settings />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
