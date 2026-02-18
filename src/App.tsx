import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import { createPublicClient, http, formatEther, parseEther } from 'viem';
import { neuraTestnet } from './network';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { TrendingUp, Zap, ShieldCheck, LogOut, Send } from 'lucide-react';

const ASSETS = ["ANKR", "BTC", "ETH", "SOL", "BNB", "XRP"];
const chartData = [{v:2},{v:5},{v:3},{v:8},{v:6},{v:10},{v:9},{v:12}];

function App() {
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string>("---");
  const [prices, setPrices] = useState<any>({});
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txLoading, setTxLoading] = useState(false);

  // PRIORIDADE: Carteira embutida do Privy (Embedded) vinculada ao Discord
  const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
  const activeWallet = embeddedWallet || wallets[0];
  const walletAddress = user?.wallet?.address || activeWallet?.address;

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
      } catch (e) { console.error(e); }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function getBalance() {
      if (authenticated && walletAddress) {
        try {
          const client = createPublicClient({ 
            chain: neuraTestnet, 
            transport: http("https://rpc.ankr.com/neura_testnet", { fetchOptions: { mode: 'cors' } }) 
          });
          const b = await client.getBalance({ address: walletAddress as `0x${string}` });
          setBalance(formatEther(b));
        } catch (e) { console.error(e); }
      }
    }
    getBalance();
    const id = setInterval(getBalance, 10000);
    return () => clearInterval(id);
  }, [authenticated, walletAddress]);

  const handleTransfer = async () => {
    if (!recipient || !amount) return toast.error("Provide address and amount");
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

  if (!authenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#0f172a' }}>NEURA WALLET</h1>
        <button onClick={login} style={{ padding: '18px 50px', borderRadius: '50px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Login with Discord</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '120px 40px' }}>
      <Toaster position="top-right" />
      
      {/* TICKER */}
      <div style={{ position: 'fixed', top: '30px', left: 0, width: '100%', overflow: 'hidden' }}>
        <motion.div animate={{ x: [0, -1200] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ display: 'flex', gap: '80px' }}>
          {[...ASSETS, ...ASSETS].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px' }}>
              <b style={{ color: a === 'ANKR' ? '#00cc6a' : '#1e293b' }}>{a}</b>
              <span>${prices[a] || '---'}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '30px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '25px', borderRadius: '30px' }}>
          <TrendingUp size={18} /> <b>WATCHLIST</b>
          {ASSETS.map(asset => (
            <div key={asset} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span>{asset}</span>
              <b>${prices[asset] || '0.00'}</b>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', padding: '50px', borderRadius: '50px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
          <p>AVAILABLE BALANCE</p>
          <h2 style={{ fontSize: '4rem', fontWeight: '900' }}>{balance} <span style={{ color: '#00cc6a' }}>ANKR</span></h2>
          
          <div style={{ height: '100px', margin: '20px 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}><Area type="monotone" dataKey="v" stroke="#00cc6a" fill="#00cc6a" fillOpacity={0.05}/></AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '25px', textAlign: 'left' }}>
            <p><Send size={14}/> QUICK SEND</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input placeholder="Address" value={recipient} onChange={e => setRecipient(e.target.value)} style={{ flex: 2, padding: '12px', borderRadius: '10px' }} />
              <input placeholder="Amt" type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '10px' }} />
              <button onClick={handleTransfer} style={{ padding: '0 20px', borderRadius: '10px', background: '#0f172a', color: '#fff' }}>Send</button>
            </div>
          </div>

          <div style={{ background: '#0f172a', color: '#fff', padding: '15px', borderRadius: '20px', marginTop: '20px', textAlign: 'left' }}>
            <small style={{ color: '#00cc6a' }}>MY ACCOUNT</small>
            <code style={{ display: 'block', fontSize: '11px', wordBreak: 'break-all' }}>{walletAddress}</code>
          </div>
          <button onClick={logout} style={{ marginTop: '20px', border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}><LogOut size={16}/> Sign Out</button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.7)', padding: '25px', borderRadius: '30px' }}>
          <Zap size={18} color="#00cc6a" /> <b>INSIGHTS</b>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>Neura Network status is stable. Use faucet to get test tokens.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
