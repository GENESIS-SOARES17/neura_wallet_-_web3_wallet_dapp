import { useState, useEffect } from 'react'

interface PriceData {
  symbol: string
  price: string
  change: number
}

export const usePrices = () => {
  const [prices, setPrices] = useState<PriceData[]>([
    { symbol: 'ANKR', price: '0.0234', change: 2.45 },
    { symbol: 'BTC', price: '67,432.50', change: 1.23 },
    { symbol: 'ETH', price: '3,456.78', change: -0.87 },
    { symbol: 'SOL', price: '178.92', change: 5.67 },
    { symbol: 'BNB', price: '598.34', change: 0.45 },
    { symbol: 'XRP', price: '0.5234', change: -1.23 },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const symbols = ['ANKRUSDT', 'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT']
        const responses = await Promise.all(
          symbols.map(symbol =>
            fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
              .then(res => res.json())
              .catch(() => null)
          )
        )

        const newPrices: PriceData[] = responses.map((data, index) => {
          if (data && data.lastPrice) {
            const price = parseFloat(data.lastPrice)
            const change = parseFloat(data.priceChangePercent)
            return {
              symbol: symbols[index].replace('USDT', ''),
              price: price > 1000 ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : price.toFixed(4),
              change: change
            }
          }
          return prices[index]
        })

        setPrices(newPrices)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching prices:', error)
        setIsLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 10000)
    return () => clearInterval(interval)
  }, [])

  return { prices, isLoading }
}
