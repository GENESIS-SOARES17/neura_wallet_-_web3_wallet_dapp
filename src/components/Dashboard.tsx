import React from 'react'
import { PriceTicker } from './PriceTicker'
import { WatchlistCard } from './WatchlistCard'
import { MainWalletCard } from './MainWalletCard'
import { InsightsCard } from './InsightsCard'
import { StatusBar } from './StatusBar'
import { useBalance } from '../hooks/useBalance'

interface DashboardProps {
  onLogout: () => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  useBalance()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Price Ticker */}
      <PriceTicker />

      {/* Main Content */}
      <div className="flex-1 p-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-neura-green to-neura-dark rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neura-dark">NEURA WALLET</h1>
                <p className="text-sm text-gray-500">Neura Testnet • EOA Wallet</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* 3 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Watchlist */}
            <div className="lg:col-span-3">
              <WatchlistCard />
            </div>

            {/* Center Column - Main Wallet */}
            <div className="lg:col-span-6">
              <MainWalletCard />
            </div>

            {/* Right Column - Insights */}
            <div className="lg:col-span-3">
              <InsightsCard />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}
