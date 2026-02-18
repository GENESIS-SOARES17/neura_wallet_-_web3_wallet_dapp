import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect, useMemo } from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { neuraTestnet } from './network';

function App() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState("0.0000");

  // --- LOGICA PARA FIXAR A CARTEIRA ---
  const walletAddress = useMemo(() => {
    // 1. Tenta achar a carteira que o Privy criou (Embedded)
    const privyWallet = wallets.find((w) => w.walletClientType === 'privy');
    // 2. Se não achar, tenta a carteira padrão do usuário logado
    // 3. Se não, pega a primeira da lista, mas dá preferência total ao ID do Privy
    return privyWallet?.address || user?.wallet?.address || wallets[0]?.address;
  }, [wallets, user]);

  useEffect(() => {
    async function updateBalance() {
      if (ready && authenticated && walletAddress) {
        try {
          const client = createPublicClient({ 
            chain: neuraTestnet, 
            transport: http("https://rpc.ankr.com/neura_testnet") 
          });
          const b = await client.getBalance({ address: walletAddress as `0x${string}` });
          setBalance(formatEther(b));
        } catch (e) { console.error("Erro saldo:", e); }
      }
    }
    updateBalance();
    const id = setInterval(updateBalance, 10000);
    return () => clearInterval(id);
  }, [ready, authenticated, walletAddress]);

  if (!ready) return <div style={{color: '#00cc6a', textAlign: 'center', marginTop: '50px'}}>CARREGANDO NEURA WALLET...</div>;

  if (!authenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
        <button onClick={login} style={{ padding: '15px 30px', background: '#00cc6a', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
          ENTRAR COM DISCORD
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#0f172a' }}>NEURA WALLET</h1>
      
      <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '0 auto' }}>
        <p style={{ color: '#64748b' }}>SALDO ATUAL</p>
        <h2 style={{ fontSize: '3rem', margin: '10px 0' }}>{Number(balance).toFixed(4)} <span style={{color: '#00cc6a'}}>ANKR</span></h2>
        
        <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '10px', marginTop: '20px' }}>
          <small style={{ color: '#64748b', fontWeight: 'bold' }}>ENDEREÇO DA CARTEIRA DISCORD:</small>
          <code style={{ display: 'block', wordBreak: 'break-all', marginTop: '10px', color: '#0f172a' }}>
            {walletAddress || "Gerando endereço..."}
          </code>
        </div>

        <button onClick={logout} style={{ marginTop: '30px', background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>
          SAIR DA CONTA
        </button>
      </div>
    </div>
  );
}

export default App;
