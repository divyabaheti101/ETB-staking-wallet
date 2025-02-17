import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useContractRead } from "wagmi";

function Unstake(props) {
    const [show, setShow] = useState(false)
    const [balance, setBalance] = useState(0)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const {data: dataBalance} = useContractRead({
        ...props.stakingWalletContract,
        functionName: 'currentStake',
        watch: true,
        args: [props.walletId]
    })

    useEffect(() => {
        if(dataBalance){
            const result = ethers.utils.formatEther(dataBalance)
            setBalance(result)
        }
    }, [dataBalance])

    const unstakeETH = async () => {
        if (balance > 0) {
            await props.contract.unstakeEth(props.walletId)
        }
        setShow(false)
    }

    return (
        <>
            <Button variant='warning' onClick={handleShow}>
                Unstake everything
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Unstake ETH form staking pool</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This will unstake all the ETH from your staking pool and the ETH will
                    be deposited to your wallet. You will get rewarded with the
                    appropriate amount of WEB3 ERC20 tokens
                    <br />
                    <br />
                    You're about to unstake{' '}
                    <span style={{ fontWeight: 'bold' }}>
                        {balance}
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    {balance > 0 ?
                    (<Button variant="primary" onClick={unstakeETH}>
                        Confirm
                    </Button>) :
                    (<Button variant="secondary" onClick={unstakeETH}>
                        Nothing to Unstake
                    </Button>)}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Unstake;