import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Staking from './artifacts/contracts/Staking.sol/Staking.json'
import StakingPoolInfo from './components/StakingPoolInfo';
import { useContract, useContractRead, useSigner } from 'wagmi'
import { Button, Container, Row, Table } from 'react-bootstrap';
import Deposit from './components/Deposit';

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

  const { data: wallets } = useContractRead({
    ...stakingWalletContract,
    functionName: 'getWallets',
    watch: true,
  })


  return (
    <div className='container flex flex-col items-center mt-10'>
      <div className='flex-mb-6'>
        <ConnectButton />
      </div>

      <StakingPoolInfo stakingWalletContract={stakingWalletContract} />

      <br />

      <Container>
        <Row>
          <h3 className='text-5xl font-bold mb-20'>{'My Wallets'}</h3>
        </Row>
        <Row>
          <Table striped hover bordered>
            <thead>
              <tr>
                <th>Wallet Id</th>
                <th>Deposit</th>
                <th>Current Balance</th>

                <th>Withdraw</th>
                <th>Staked?</th>
                <th>Stake</th>
                <th>Current Stake</th>
                <th>Unstake</th>
                <th>Current Staked Rewards</th>
              </tr>
            </thead>
            <tbody>
              { wallets && wallets.map((wallet, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <Deposit contract={contract} walletId={i} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Row>
      </Container>

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
