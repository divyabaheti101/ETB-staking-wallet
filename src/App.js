import logo from './logo.svg';
import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Staking from './artifacts/contracts/Staking.sol/Staking.json'
import StakingPoolInfo from './components/StakingPoolInfo';

function App() {
  const stakingWalletContract = {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: Staking.abi,
  }


  return (
    <div className='container flex flex-col items-center mt-10'>
      <div className='flex-mb-6'>
        <ConnectButton />
      </div>

      <StakingPoolInfo stakingWalletContract={stakingWalletContract} />

      <br />

      
    </div>
  );
}

export default App;
