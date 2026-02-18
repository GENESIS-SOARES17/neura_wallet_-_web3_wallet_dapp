import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect, useMemo } from 'react';
import { createPublicClient, http, formatEther, parseEther } from 'viem';
import { neuraTestnet } from './network';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { TrendingUp, Zap, ShieldCheck, LogOut, Send } from 'lucide-react';

const ASSETS = ["ANKR", "BTC", "ETH", "SOL", "BNB", "XRP"];
const chartData = [{v:2},{v:5},{v:3},{v:8},{v:6},{v:10},{v:9},{v:12}];

function App() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string>("0.0000");
  const [prices, setPrices] = useState<any>({});
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txLoading, setTxLoading] = useState(false);

  // --- TRAVA DE ENDEREÇO DEFINITIVA ---
  // Priorizamos o endereço vinculado ao perfil do usuário no banco do Privy
  const walletAddress = useMemo(() => {
    return user?.wallet?.address || wallets.find(w => w.walletClientType === 'privy')?.address;
  }, [user, wallets]);

  // Busca de preços (Ticker)
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price');
        const data = await res.json();
        const priceMap: any = {};
        data.forEach((item: any) => {
          const symbol = item.symbol.replace('USDT', '');
          if (ASSETS.includes(symbol)) priceMap[symbol] = parseFloat(item.price).toLocaleString();
        });
        setPrices(priceMap);
      } catch (e) { console.error("Price fetch error"); }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Busca de saldo na Neura
  useEffect(() => {
    async function getBalance() {
      if (ready && authenticated && walletAddress) {
        try {
          const client = createPublicClient({ 
            chain: neuraTestnet, 
            transport: http("https://rpc.ankr.com/neura_testnet", { fetchOptions: { mode: 'cors' } }) 
          });
          const b = await client.getBalance({ address: walletAddress as `0x${string}` });
          setBalance(formatEther(b));
        } catch (e) { console.error("Balance fetch error"); }
      }
    }
    getBalance();
    const id = setInterval(getBalance, 10000);
    return () => clearInterval(id);
  }, [ready, authenticated, walletAddress]);

  // Lógica de Envio
  const handleTransfer = async () => {
    if (!recipient || !amount) return toast.error("Provide address and amount");
    const activeWallet = wallets.find((w) => w.walletClientType === 'privy') || wallets[0];
    if (!activeWallet) return toast.error("Wallet not ready");
    
    setTxLoading(true);
    const tid = toast.loading("Processing on Neura...");
    try {
      await activeWallet.switchChain(neuraTestnet.id);
      const provider = await activeWallet.getEthereumProvider();
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: walletAddress, to: recipient, value: '0x' + parseEther(amount).toString(16) }],
      });
      toast.success(`Sent! Hash: ${hash.substring(0, 8)}`, { id: tid });
      setAmount(""); setRecipient("");
    } catch (e: any) { toast.error(e.message || "Failed", { id: tid }); }
    finally { setTxLoading(false); }
  };

  if (!ready) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#00cc6a', fontSize: '1.2rem', fontWeight: 'bold' }}>SYNCING WITH NEURA...</div>;

  if (!authenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>NEURA WALLET</h1>
        <p style={{ color: '#64748b', letterSpacing: '4px', marginBottom: '40px' }}>SECURE BLOCKCHAIN GATEWAY</p>
        <button onClick={login} style={{ padding: '18px 50px', borderRadius: '50px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>Login to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '120px 40px 40px 40px', boxSizing: 'border-box', position: 'relative', background: '#f1f5f9' }}>
      <Toaster position="top-right" />
      
      {/* HEADER TICKER */}
      <div style={{ position: 'fixed', top: '30px', left: 0, width: '100%', overflow: 'hidden', zIndex: 10 }}>
        <motion.div animate={{ x: [0, -1200] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ display: 'flex', gap: '80px' }}>
          {[...ASSETS, ...ASSETS].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
              <b style={{ fontSize: '1.4rem', color: a === 'ANKR' ? '#00cc6a' : '#1e293b' }}>{a}</b>
              <span style={{ fontSize: '1.1rem', color: '#64748b' }}>${prices[a] || '---'}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '30px', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/*
