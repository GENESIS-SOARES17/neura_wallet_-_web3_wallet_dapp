import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { usePrices } from '../hooks/usePrices'

export const PriceTicker: React.FC = () => {
  const { prices } = usePrices()

  const tickerContent = [...prices, ...prices].map((price, index) => (
    <div key={index} className="flex items-center gap-3 px-6">
      <span className="font-semibold text-white">{price.symbol}</span>
      <span className="text-gray-300">${price.price}</span>
      <span className={`flex items-center gap-1 text-sm ${price.change >= 0 ? 'text-neura-green' : 'text-red-400'}`}>
        {price.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}%
      </span>
    </div>
  ))

  return (
    <div className="bg-neura-dark py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {tickerContent}
        {tickerContent}
      </div>
    </div>
  )
}
