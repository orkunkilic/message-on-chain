import { Button, Divider, Input, Page, Slider, Spacer, Text } from "@geist-ui/core";
import { ConnectKitButton } from "connectkit";
import { useState } from "react";
import { useAccount, useNetwork, useSendTransaction, useWaitForTransaction } from "wagmi";
import { useDebounce } from 'use-debounce'
import { usePrepareSendTransaction } from 'wagmi'
import { ethers } from "ethers";
import Tip from "./Tip";

function App() {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [debouncedMessage] = useDebounce(message, 500)
  const [debouncedAmount] = useDebounce(amount, 500)
  const [debouncedTo] = useDebounce(recipient, 500)

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? ethers.utils.parseEther(debouncedAmount) : undefined,
      data: debouncedMessage ? ethers.utils.hexlify(ethers.utils.toUtf8Bytes(debouncedMessage)) : undefined,
    },
  })
  
  const { data, sendTransaction } = useSendTransaction(config)
 
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  
  return (
    <Page>
      <Text h1>Message On-Chain</Text>
      <ConnectKitButton showBalance/>
      <Spacer h={0.1} />
      {address && <Text small>Current network: {chain?.name}</Text>}
      <Divider />
      {address && (
        <div style={{display:"flex", flexDirection: "column"}}>
          <Text small>Message to send</Text>
          <Spacer h={0.1} />
          <Input width='400px' value={message} onChange={(e) => setMessage(e.target.value)}/>
          <Spacer h={1} />
          <Text small>Recipient address</Text>
          <Spacer h={0.1} />
          <Input width='400px' value={recipient} onChange={(e) => setRecipient(e.target.value)}/>
          <Spacer h={1} />
          <Text small>Amount to send (optional) ({chain?.nativeCurrency.symbol})</Text>
          <Spacer h={0.1} />
          <Input width='400px' value={amount} onChange={(e) => setAmount(e.target.value)}/>
          <Spacer h={1} />
          <Button type='success' style={{width:'200px'}} disabled={!message || !recipient} onClick={sendTransaction}>Send Message</Button>
        </div>
      )}
      <Spacer h={1} />
      {!address && <Text h3>Please connect your wallet first</Text>}
      {(isLoading || isSuccess) && (
        <>
          {isLoading && <Text h3>Waiting for transaction to be processed...</Text>}
          {isSuccess && <Text h3>Transaction sent!</Text>}
          <a href={`${chain.blockExplorers.default.url}/tx/${data?.hash}`} target='blank'>View on transaction scanner</a>
          <Spacer h={1} />
        </>
      )}
      <Divider />
      <Spacer h={1} />
      <Text small>Created by <a href='https://twitter.com/0x_orkun' target='blank'>@0x_orkun</a></Text>
      <Spacer h={1} />
      {address && <Tip />}

      <Text small>Powered by <a href='https://wagmi.sh' target='blank'>Wagmi</a> & <a href='https://geist-ui.dev' target='blank'>Geist</a></Text>
    </Page>
  );
}

export default App;
