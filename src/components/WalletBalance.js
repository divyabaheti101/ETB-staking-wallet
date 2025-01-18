import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

function WalletBalance(props){
    const [balance, setBalance] = useState(0)

    const {data: dataBalance} = useContractRead({
        ...props.stakingWalletContract,
        functionName: 'walletBalance',
        watch: true,
        args: [props.walletId]
    })

    useEffect(() => {
        if (dataBalance) {
            const result = ethers.utils.formatEther(dataBalance)
            setBalance(result)
        }

    }, [dataBalance])

    return (
        <>
         {balance} ETH
        </>
    )
}

export default WalletBalance;