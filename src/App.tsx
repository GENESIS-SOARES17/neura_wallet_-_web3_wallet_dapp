import React, { useState, useEffect } from 'react'
import { LoginScreen } from './components/LoginScreen'
import { Dashboard } from './components/Dashboard'
import { useWalletStore } from './store/walletStore'

function App() {
  const { isAuthenticated, mockLogin, mockLogout } = useWalletStore()

  return (
    <div className="min-h-screen bg-[#f1f5f9] relative overflow-hidden">
      {/* Watermark Background */}
      <div className="watermark-bg" />
      
      {/* Main Content */}
      <div className="relative z-10">
        {!isAuthenticated ? (
          <LoginScreen onLogin={mockLogin} />
        ) : (
          <Dashboard onLogout={mockLogout} />
        )}
      </div>
    </div>
  )
}

export default App
