import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Staking from './artifacts/contracts/Staking.sol/Staking.json'
import StakingPoolInfo from './components/StakingPoolInfo';
import { Button, Container, Row, Table } from 'react-bootstrap';
import Deposit from './components/Deposit';
import WalletBalance from './components/WalletBalance';
import Withdraw from './components/Withdraw';
import { ethers } from 'ethers';
import Stake from './components/Stake';
import Unstake from './components/Unstake';
import CurrentReward from './components/CurrentReward';
import { useReadContract, useWalletClient } from 'wagmi';
import { getContract } from 'viem';

function App() {
  const stakingWalletContract = {
    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    abi: Staking.abi,
  }

  // Create a contract instance
  const { data: walletClient } = useWalletClient()
  const contract = getContract({
    address: stakingWalletContract.address,
    abi: stakingWalletContract.abi,
    walletClient: walletClient
  })


  // Create a new wallet
  const walletCreate = async () => {
    await contract.walletCreate()
  }

  const { data: wallets } = useReadContract({
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
                    <td>
                      <WalletBalance stakingWalletContract={stakingWalletContract} walletId = {i} />
                    </td>
                    <td>
                      <Withdraw contract={contract} walletId = {i} />
                    </td>
                    <td>
                      {ethers.utils.formatEther(wallet.stakedAmount) > 0 ? 
                      'Yes' : 'No'}
                    </td>
                    <td>
                      <Stake stakingWalletContract={stakingWalletContract} walletId={i} contract={contract} />
                    </td>
                    <td>
                      {ethers.utils.formatEther(wallet.stakedAmount)}
                    </td>
                    <td>
                      <Unstake stakingWalletContract={stakingWalletContract} walletId={i} />
                    </td>
                    <td>
                      <CurrentReward contract={contract} walletId={i} />
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
