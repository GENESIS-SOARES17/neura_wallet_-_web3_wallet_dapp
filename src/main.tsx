import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmlryv7zk04ox0cjv1hfm2dax"
      config={{
        // FORÇA a recuperação da carteira vinculada ao ID social
        embeddedWallets: {
          createOnLogin: 'all-users', 
          noPromptOnSignature: true,
        },
        // Garante que a sessão não expire e crie um novo usuário "fantasma"
        loginMethods: ['discord'],
        appearance: {
          theme: 'dark',
          accentColor: '#00cc6a',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);
