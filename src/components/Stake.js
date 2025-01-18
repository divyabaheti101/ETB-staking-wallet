import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import WalletBalance from "./WalletBalance";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";

function Stake(props){
    const [show, setShow] = useState(false)
    const [scBalance, setScBalance] = useState(0)

    const stakeETH = async () => {
        if (scBalance > 0){
            await props.contract.stakeEth(props.walletId);
        }
        setShow(false)
    }

    const {data: dataBalance } = useContractRead({
        ...props.stakingWalletContract,
        functionName: 'walletBalance',
        watch: true,
        args: [props.walletId]
    })

    useEffect(() => {
        if(dataBalance){
            const result = ethers.utils.formatEther(dataBalance)
            setScBalance(result)
        }
    }, [dataBalance])



    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Stake Everything
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Stake ETH to Staking Pool</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This will stake all the ETH from your wallet to the staking pool and
                    you will start to earn rewards in the form of WEB3 ERC20 tokens
                    <br />
                    <br />
                    You're About to Stake {' '}
                    <span style={{ fontWeight: 'bold' }}>
                        {' '}
                        <WalletBalance stakingWalletContract={props.stakingWalletContract}
                            walletId = {props.walletId} />
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    {scBalance > 0 ? (
                        <Button variant="primary" onClick={stakeETH}>
                            Confirm
                        </Button>
                    ) :
                    (
                        <Button variant="secondary" onClick={stakeETH}>
                            Nothing to Stake
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Stake;