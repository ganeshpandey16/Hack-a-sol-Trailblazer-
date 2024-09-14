// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Messaging {
    struct Message {
        address sender;
        address receiver;
        string contentHash;  // Store the IPFS hash of the encrypted message
        uint256 timestamp;
    }

    Message[] public messages;

    event MessageSent(address indexed sender, address indexed receiver, string contentHash, uint256 timestamp);

    function sendMessage(address _receiver, string memory _contentHash) public {
        messages.push(Message({
            sender: msg.sender,
            receiver: _receiver,
            contentHash: _contentHash,
            timestamp: block.timestamp
        }));
        emit MessageSent(msg.sender, _receiver, _contentHash, block.timestamp);
    }

    // Get all messages
    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

    // Get messages for a specific receiver (only the receiver's messages)
    function getMessagesForReceiver(address _receiver) public view returns (Message[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].receiver == _receiver) {
                count++;
            }
        }

        Message[] memory receiverMessages = new Message[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].receiver == _receiver) {
                receiverMessages[index] = messages[i];
                index++;
            }
        }

        return receiverMessages;
    }
}

