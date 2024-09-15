import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MessagingContract from './MessagingContract.json';  // ABI JSON file

const MessagingComponent = () => {
  const [account, setAccount] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [contractInstance, setContractInstance] = useState(null);

  // Load blockchain data and fetch messages for the logged-in user
  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");  // Change provider if necessary
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    const messagingData = MessagingContract.networks[networkId];
    
    if (messagingData) {
      const messaging = new web3.eth.Contract(MessagingContract.abi, messagingData.address);
      setContractInstance(messaging);

      // Fetch messages for the logged-in user (receiver)
      const receiverMessages = await messaging.methods.getMessages().call();
      setMessages(receiverMessages.filter(msg => msg.receiver.toLowerCase() === accounts[0].toLowerCase()));
    } else {
      alert('Smart contract not deployed to detected network.');
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  // Function to send a new message
  const handleSendMessage = async () => {
    if (!receiver || !message) {
      alert('Please provide both receiver address and message.');
      return;
    }

    try {
      // Send the message through the contract
      await contractInstance.methods.sendMessage(receiver, message).send({ from: account });
      alert('Message sent successfully!');

      // Clear the message input after sending
      setMessage('');

      // Reload the messages after sending
      const updatedMessages = await contractInstance.methods.getMessages().call();
      setMessages(updatedMessages.filter(msg => msg.receiver.toLowerCase() === account.toLowerCase()));
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  return (
    <div>
      <h1>Messaging DApp</h1>

      {/* Send Message Section */}
      <div>
        <h2>Send a Message</h2>
        <input 
          type="text" 
          value={receiver} 
          onChange={e => setReceiver(e.target.value)} 
          placeholder="Receiver Address" 
        />
        <textarea 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          placeholder="Message Content"
        ></textarea>
        <button onClick={handleSendMessage}>Send Message</button>
      </div>

      <hr />

      {/* Display Messages Section */}
      <div>
        <h2>Messages for {account}</h2>
        <ul>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <li key={index}>
                <p><strong>From:</strong> {msg.sender}</p>
                <p><strong>Message:</strong> {msg.contentHash}</p>
                <p><strong>Timestamp:</strong> {new Date(msg.timestamp * 1000).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <p>No messages received.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MessagingComponent;
