import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmlryv7zk04ox0cjv1hfm2dax" // Sua API Key atualizada
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          noPromptOnSignature: false,
        },
        appearance: {
          theme: 'light',
          accentColor: '#00cc6a',
          showWalletLoginFirst: false,
        },
        loginMethods: ['discord', 'email', 'google'],
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);
