import React, { useState, useEffect } from 'react';
import { sendSignedMessage } from './contract';

function MessagingComponent() {
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!receiver || !message) {
      alert('Please provide both receiver address and message.');
      return;
    }

    try {
      // Send signed message
      await sendSignedMessage(receiver, message);

      setMessage(''); // Clear the message input after sending
      alert('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  return (
    <div>
      <h1>Messaging App</h1>
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
  );
}

export default MessagingComponent;

// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import MessagingContract from './MessagingContract.json';  // ABI JSON file

// const MessagingComponent = () => {
//   const [account, setAccount] = useState('');
//   const [messages, setMessages] = useState([]);
  
//   const loadBlockchainData = async () => {
//     const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");  // Change provider if necessary
//     const accounts = await web3.eth.getAccounts();
//     setAccount(accounts[0]);

//     const networkId = await web3.eth.net.getId();
//     const messagingData = MessagingContract.networks[networkId];
    
//     if (messagingData) {
//       const messaging = new web3.eth.Contract(MessagingContract.abi, messagingData.address);

//       // Fetch messages for the logged-in user (receiver)
//       const receiverMessages = await messaging.methods.getMessagesForReceiver(accounts[0]).call();
//       setMessages(receiverMessages);
//     } else {
//       alert('Smart contract not deployed to detected network.');
//     }
//   };

//   useEffect(() => {
//     loadBlockchainData();
//   }, []);

//   return (
//     <div>
//       <h1>Messages for {account}</h1>
//       <ul>
//         {messages.length > 0 ? (
//           messages.map((msg, index) => (
//             <li key={index}>
//               <p>From: {msg.sender}</p>
//               <p>Message: {msg.contentHash}</p>
//               <p>Timestamp: {new Date(msg.timestamp * 1000).toLocaleString()}</p>
//             </li>
//           ))
//         ) : (
//           <p>No messages received.</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default MessagingComponent;
