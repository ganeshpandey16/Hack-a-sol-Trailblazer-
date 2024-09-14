
import Web3 from 'web3';
import MessagingABI from './MessagingABI.json';
import { Buffer } from 'buffer';

// Web3 setup for sender and receiver Ganache instances
const web3Sender = new Web3(new Web3.providers.HttpProvider("http://localhost:7545")); // Sender's Ganache
const web3Receiver = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Receiver's Ganache

// Contract address and ABI
const contractAddress = '0xf6F4Ee39ffC8A04323999cAbeF9Ed019A05D3608'; // Replace with actual contract address
const messagingContractSender = new web3Sender.eth.Contract(MessagingABI, contractAddress);
const messagingContractReceiver = new web3Receiver.eth.Contract(MessagingABI, contractAddress);

// Sender's account and private key
const senderPrivateKey = '0x2aa1f649307f5a9ae805ff915e1265faa3c47656500cbd543bf24939fcbac41d'; // Replace with sender's private key
const senderAddress = '0x8Bc390b21A87664a2b7B924bBc94d4D6622340d5'; // Replace with sender's address

// Function to send a signed message transaction
export const sendSignedMessage = async (receiverAddress, messageContent) => {
  try {
    // Step 1: Get the transaction data
    const data = messagingContractSender.methods.sendMessage(receiverAddress, messageContent).encodeABI();

    // Step 2: Prepare the transaction
    const tx = {
      from: senderAddress,
      to: contractAddress,
      gas: 2000000,
      data: data
    };

    // Step 3: Sign the transaction
    const signedTx = await web3Sender.eth.accounts.signTransaction(tx, senderPrivateKey);

    // Step 4: Send the signed transaction to both sender and receiver's Ganache instances
    const senderTxReceipt = await web3Sender.eth.sendSignedTransaction(signedTx.rawTransaction);
    const receiverTxReceipt = await web3Receiver.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log('Transaction sent successfully');
    console.log('Sender Ganache Transaction Hash:', senderTxReceipt.transactionHash);
    console.log('Receiver Ganache Transaction Hash:', receiverTxReceipt.transactionHash);
  } catch (error) {
    console.error('Error sending signed transaction:', error);
  }
};
