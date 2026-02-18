import React from 'react'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'
import { usePrices } from '../hooks/usePrices'

export const WatchlistCard: React.FC = () => {
  const { prices, isLoading } = usePrices()

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xl h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neura-dark flex items-center gap-2">
          <Star className="w-5 h-5 text-neura-green" />
          Watchlist
        </h2>
        <span className="text-xs text-gray-400">Live</span>
      </div>

      <div className="space-y-4">
        {prices.map((asset, index) => (
          <div
            key={asset.symbol}
            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                index === 0 ? 'bg-gradient-to-br from-neura-green to-emerald-600' :
                index === 1 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                index === 2 ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                index === 3 ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                index === 4 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}>
                {asset.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-neura-dark">{asset.symbol}</p>
                <p className="text-xs text-gray-400">
                  {asset.symbol === 'ANKR' ? 'Ankr Network' :
                   asset.symbol === 'BTC' ? 'Bitcoin' :
                   asset.symbol === 'ETH' ? 'Ethereum' :
                   asset.symbol === 'SOL' ? 'Solana' :
                   asset.symbol === 'BNB' ? 'BNB Chain' : 'Ripple'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-neura-dark">${asset.price}</p>
              <p className={`text-xs flex items-center justify-end gap-1 ${asset.change >= 0 ? 'text-neura-green' : 'text-red-500'}`}>
                {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
