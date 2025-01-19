import { ethers } from "ethers";
import { useState } from "react";
import { Button } from "react-bootstrap";

function CurrentReward(props){
    const [stakeReward, setStakereward] = useState(0)

    const getReward = async () => {
        const result = await props.contract.currentReward(props.walletId)
        setStakereward(ethers.utils.formatEther(result))
    }

    return(
        <>
            {stakeReward} WEB3{' '}
            <Button variant="info" onClick={getReward}>
                Refresh
            </Button>
        </>
    )
}

export default CurrentReward;