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
          // 'all-users' força o Privy a buscar uma carteira já existente no banco de dados deles
          createOnLogin: 'all-users', 
          noPromptOnSignature: true,
        },
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
