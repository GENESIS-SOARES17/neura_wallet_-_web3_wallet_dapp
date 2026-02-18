import { create } from 'zustand'

interface WalletState {
  isAuthenticated: boolean
  walletAddress: string | null
  balance: string
  isLoading: boolean
  mockLogin: () => void
  mockLogout: () => void
  setBalance: (balance: string) => void
  setLoading: (loading: boolean) => void
}

// Generate a random wallet address for demo
const generateMockAddress = () => {
  const chars = '0123456789abcdef'
  let address = '0x'
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}

export const useWalletStore = create<WalletState>((set) => ({
  isAuthenticated: false,
  walletAddress: null,
  balance: '0.00',
  isLoading: false,
  mockLogin: () => set({ 
    isAuthenticated: true, 
    walletAddress: generateMockAddress(),
    balance: (Math.random() * 100 + 10).toFixed(4)
  }),
  mockLogout: () => set({ 
    isAuthenticated: false, 
    walletAddress: null,
    balance: '0.00'
  }),
  setBalance: (balance) => set({ balance }),
  setLoading: (isLoading) => set({ isLoading }),
}))
