import { Button, Input, Slider, Spacer, Text } from "@geist-ui/core";
import { useState } from "react";
import { useNetwork, useSendTransaction, useWaitForTransaction } from "wagmi";
import { useDebounce } from 'use-debounce'
import { usePrepareSendTransaction } from 'wagmi'
import { ethers } from "ethers";

export default function Tip() {
    const { chain } = useNetwork();
    const [tipAmount, setTipAmount] = useState('0.1')
    const [debouncedTipAmount] = useDebounce(tipAmount, 500)
    const { config } = usePrepareSendTransaction({
    request: {
        to: "0xF5f7fc554CB91c897861C64Cd86aFCc96Beeae71",
        value: debouncedTipAmount ? ethers.utils.parseEther(debouncedTipAmount) : undefined
    },
    })
    
    const { data, sendTransaction } = useSendTransaction(config)
    
    const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    })

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
        <Text small>Tip amount ({chain?.nativeCurrency.symbol})</Text>
        <Input width='400px' value={tipAmount} onChange={(e) => setTipAmount(e.target.value)}/>
        <Spacer w={1} />
        <Button type='success' style={{width:'100px'}} disabled={!tipAmount} onClick={sendTransaction}>Tip me</Button>
        <Spacer w={1} />
        {(isLoading || isSuccess) && (
        <>
          {isLoading && <Text h3>Waiting for transaction to be processed...</Text>}
          {isSuccess && <Text h3>Transaction sent!</Text>}
          <a href={`${chain.blockExplorers.default.url}/tx/${data?.hash}`} target='blank'>View on transaction scanner</a>
        </>
      )}
    </div>
  )
}
