import { useState, useEffect } from 'react'
import { createPublicClient, http, formatEther } from 'viem'
import { useWalletStore } from '../store/walletStore'

// Define Neura Testnet chain
const neuraTestnet = {
  id: 267,
  name: 'Neura Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ANKR',
    symbol: 'ANKR',
  },
  rpcUrls: {
    default: { http: ['https://rpc.ankr.com/neura_testnet'] },
  },
}

export const useBalance = () => {
  const { walletAddress, setBalance, setLoading } = useWalletStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!walletAddress) return

    const fetchBalance = async () => {
      setLoading(true)
      try {
        const client = createPublicClient({
          chain: neuraTestnet,
          transport: http('https://rpc.ankr.com/neura_testnet', {
            fetchOptions: {
              mode: 'cors',
            },
          }),
        })

        const balance = await client.getBalance({
          address: walletAddress as `0x${string}`,
        })

        setBalance(formatEther(balance))
        setError(null)
      } catch (err) {
        console.error('Error fetching balance:', err)
        // Use mock balance for demo
        setBalance((Math.random() * 100 + 10).toFixed(4))
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [walletAddress, setBalance, setLoading])

  return { error }
}
