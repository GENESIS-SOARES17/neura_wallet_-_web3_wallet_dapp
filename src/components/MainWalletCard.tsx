import React, { useState } from 'react'
import { Send, Copy, Check, Wallet, Zap, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useWalletStore } from '../store/walletStore'
import toast from 'react-hot-toast'

// Mock chart data
const chartData = [
  { time: '00:00', value: 45 },
  { time: '04:00', value: 52 },
  { time: '08:00', value: 48 },
  { time: '12:00', value: 61 },
  { time: '16:00', value: 55 },
  { time: '20:00', value: 67 },
  { time: '24:00', value: 72 },
]

export const MainWalletCard: React.FC = () => {
  const { walletAddress, balance, isLoading } = useWalletStore()
  const [copied, setCopied] = useState(false)
  const [sendAddress, setSendAddress] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [isSending, setIsSending] = useState(false)

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      toast.success('Address copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSend = async () => {
    if (!sendAddress || !sendAmount) {
      toast.error('Please fill in all fields')
      return
    }

    if (!sendAddress.startsWith('0x') || sendAddress.length !== 42) {
      toast.error('Invalid wallet address')
      return
    }

    const amount = parseFloat(sendAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid amount')
      return
    }

    if (amount > parseFloat(balance)) {
      toast.error('Insufficient balance')
      return
    }

    setIsSending(true)
    
    // Simulate transaction
    const txPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve('0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''))
        } else {
          reject(new Error('Transaction failed'))
        }
      }, 3000)
    })

    toast.promise(txPromise, {
      loading: 'Sending transaction...',
      success: (hash) => {
        setSendAddress('')
        setSendAmount('')
        return `Transaction confirmed! Hash: ${(hash as string).slice(0, 10)}...`
      },
      error: 'Transaction failed. Please try again.',
    })

    try {
      await txPromise
    } catch (e) {
      // Error handled by toast
    } finally {
      setIsSending(false)
    }
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="glass-card rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-neura-green/10 to-transparent rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-neura-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Balance</p>
                <p className="text-xs text-neura-green font-medium">Neura Testnet</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neura-green/10 rounded-full">
              <div className="w-2 h-2 bg-neura-green rounded-full animate-pulse" />
              <span className="text-xs font-medium text-neura-green">Connected</span>
            </div>
          </div>

          {/* Balance Display */}
          <div className="mb-8">
            {isLoading ? (
              <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-neura-dark">{parseFloat(balance).toFixed(4)}</span>
                <span className="text-2xl font-semibold text-gray-400">ANKR</span>
              </div>
            )}
            <p className="text-sm text-gray-400 mt-2">≈ ${(parseFloat(balance) * 0.0234).toFixed(2)} USD</p>
          </div>

          {/* Chart */}
          <div className="h-40 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00cc6a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00cc6a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00cc6a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Send Card */}
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-neura-dark rounded-xl flex items-center justify-center">
            <Send className="w-5 h-5 text-neura-green" />
          </div>
          <div>
            <h3 className="font-bold text-neura-dark">Quick Send</h3>
            <p className="text-xs text-gray-400">Transfer ANKR instantly</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">Recipient Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neura-green/50 focus:border-neura-green transition-all font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-2 block">Amount (ANKR)</label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neura-green/50 focus:border-neura-green transition-all pr-20"
              />
              <button
                onClick={() => setSendAmount(balance)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neura-green hover:text-neura-dark transition-colors"
              >
                MAX
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={isSending || !sendAddress || !sendAmount}
            className="w-full bg-gradient-to-r from-neura-green to-emerald-500 hover:from-emerald-500 hover:to-neura-green text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Send ANKR
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Wallet Address Box */}
      <div className="bg-neura-dark rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1">Wallet Address</p>
            <p className="font-mono text-white text-sm">
              {walletAddress ? truncateAddress(walletAddress) : '---'}
            </p>
          </div>
          <button
            onClick={copyAddress}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200"
          >
            {copied ? (
              <Check className="w-5 h-5 text-neura-green" />
            ) : (
              <Copy className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        {walletAddress && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="font-mono text-xs text-gray-400 break-all">{walletAddress}</p>
          </div>
        )}
      </div>
    </div>
  )
}
