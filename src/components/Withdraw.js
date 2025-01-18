import { ethers } from "ethers";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function Withdraw(props){
    const [show, setShow] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState(0)
    const [receiver, setReceiver] = useState(ethers.constants.AddressZero)

    const walletWitdraw = async () => {
        if (withdrawAmount > 0 && receiver != ethers.constants.AddressZero) {
            await props.contract.walletWithdraw(props.walletId, receiver, ethers.utils.parseEther(withdrawAmount))
            setWithdrawAmount(0)
            setReceiver(ethers.constants.AddressZero)
        }
        setShow(false)
    }

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    return (
        <>
            <Button variant="danger" onClick={handleShow} >
                Withdraw ETH
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Withdraw ETH from Wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-3' controlId='numberInEthWithdraw'>
                            <Form.Control type="text" placeholder="Enter the amount in ETH"
                                onChange={(e) => setWithdrawAmount(e.target.value)} />
                            <Form.Control type="text" placeholder="Receiver Address"
                                onChange={(e) => setReceiver(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={walletWitdraw}>
                        Withdraw
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}

export default Withdraw;