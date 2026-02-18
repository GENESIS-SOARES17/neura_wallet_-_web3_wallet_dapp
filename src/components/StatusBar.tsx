import React from 'react'
import { Activity, Wifi, Shield } from 'lucide-react'

export const StatusBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neura-dark border-t border-white/10 py-3 px-6 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neura-green rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">SYSTEM STATUS: <span className="text-neura-green">ACTIVE</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-400">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Block: 1,234,567</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Wifi className="w-4 h-4 text-neura-green" />
            <span className="text-sm">Neura Testnet (267)</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-400">
            <Shield className="w-4 h-4 text-neura-green" />
            <span className="text-sm">EOA Wallet</span>
          </div>
        </div>
      </div>
    </div>
  )
}
