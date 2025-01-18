import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Staking from './artifacts/contracts/Staking.sol/Staking.json'
import StakingPoolInfo from './components/StakingPoolInfo';
import { useContract, useContractRead, useSigner } from 'wagmi'
import { Button, Container, Row } from 'react-bootstrap';

function App() {
  const stakingWalletContract = {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: Staking.abi,
  }

  // Create a contract instance
  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: stakingWalletContract.address,
    contractInterface: stakingWalletContract.abi,
    signerOrProvider: signer,
  })

  // Create a new wallet
  const walletCreate = async () => {
    await contract.walletCreate()
  }


  return (
    <div className='container flex flex-col items-center mt-10'>
      <div className='flex-mb-6'>
        <ConnectButton />
      </div>

      <StakingPoolInfo stakingWalletContract={stakingWalletContract} />

      <br />

      <Container>
        <Row>
          <Button type='dark' onClick={walletCreate} >
            Create a new Wallet
          </Button>
        </Row>
      </Container>
            
    </div>
  );
}

export default App;
