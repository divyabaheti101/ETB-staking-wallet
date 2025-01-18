import logo from './logo.svg';
import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function App() {
  return (
    <div className='container flex flex-col items-center mt-10'>
      <div className='flex-mb-6'>
        <ConnectButton />
      </div>
    </div>
  );
}

export default App;
