import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, http, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { hardhat, mainnet, sepolia } from 'viem/chains';
import { defineChain } from 'viem';

// export const hardhat = defineChain({
//   id: 1337,
//   name: 'Hardhat Network',
//   // network: 'Hardhat',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'ETH',
//     symbol: 'ETH',
//   },
//   rpcUrls: {
//     default: {http: ['http://localhost:8545'] },
//   },
//   testnet: true,
// })

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
})

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
