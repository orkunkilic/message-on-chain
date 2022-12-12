import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { mainnet, polygon, optimism, arbitrum, avalanche, bsc, avalancheFuji } from "wagmi/chains";
import { GeistProvider, CssBaseline } from '@geist-ui/core'

const client = createClient(
  getDefaultClient({
    appName: "Message On-Chain",
    chains: [mainnet, polygon, optimism, arbitrum, avalanche, bsc, avalancheFuji]
  }),
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider mode='dark'>
        <GeistProvider themeType='dark'>
          <CssBaseline />
          <App />
        </GeistProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);