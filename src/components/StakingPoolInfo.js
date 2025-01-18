import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useBalance, useContractRead } from "wagmi";

function StakingPoolInfo(props){
    const [contractBalance, setContractBalance] = useState(0)
    const [walletsStaked, setWalletsStaked] = useState(0)

    const {data: dataContractBalance } = useBalance({
        addressOrName: props.stakingWalletContract.address,
        formatUnits: 'ether',
        watch: true,
        onError(error){
            console.log('Error while fetching balance of staking smart contract: ', error)
        }
    })

    const {data: dataWalletsStaked } = useContractRead({
        ...props.stakingWalletContract,
        functionName: 'totalAddressesStaked',
        watch: true
    })

    useEffect(() => {
        if (dataContractBalance) {
            setContractBalance(dataContractBalance.formatted)
        }
        if (dataWalletsStaked) {
            setWalletsStaked(dataWalletsStaked)
        }

    }, [dataContractBalance, dataWalletsStaked])


    return (
        <>
            <Container>
                <Row>
                    <h3 className='text-5xl font-bold mb-20'>
                        {'Smart Staking Wallet Info'}
                    </h3>
                </Row>
                <Row>
                    <Col md='auto'>Staking Pool Address:</Col>
                    <Col>{props.stakingWalletContract.address}</Col>
                </Row>
                <Row>
                    <Col md='auto'>Total Addresses Staked:</Col>
                    <Col>{walletsStaked}</Col>
                </Row>
                <Row>
                    <Col md='auto'>Total Amount Staked:</Col>
                    <Col>{contractBalance} ETH</Col>
                </Row>
            </Container>
        </>
    )
}

export default StakingPoolInfo;