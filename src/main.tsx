import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmlryv7zk04ox0cjv1hfm2dax"
      config={{
        embeddedWallets: {
          // ESSENCIAL: 'all-users' tenta recuperar a carteira vinculada ao seu ID Social
          createOnLogin: 'all-users', 
          noPromptOnSignature: true,
        },
        loginMethods: ['discord', 'email'],
        // Isso ajuda a manter a mesma sessão no navegador
        embeddedWallets: {
          createOnLogin: 'all-users',
          requireUserPasswordOnCreate: false,
        }
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);
