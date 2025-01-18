import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

const HardhatNetworkChain = {
  id: 1337,
  name: 'Hardhat Network',
  network: 'Hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'http://localhost:8545',
  },
  testnet: true,
}

const {chains, provider } = configureChains(
  [
    chain.mainnet,
    chain.arbitrum,
    chain.sepolia,
    chain.polygon,
    HardhatNetworkChain
  ],
  [
    alchemyProvider({alchemyId: process.env.ALCHEMY_KEY}),
    publicProvider()
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'StakingWalletDapp',
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient} >
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
