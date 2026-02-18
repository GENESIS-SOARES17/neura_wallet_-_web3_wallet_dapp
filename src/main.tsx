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
        // CONFIGURAÇÃO DE INFRAESTRUTURA DE CARTEIRA
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          noPromptOnSignature: true,
        },
        // FORÇA O LOGIN APENAS PELO DISCORD PARA NÃO GERAR CARTEIRAS DUPLAS
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
