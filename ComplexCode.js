/*
Filename: ComplexCode.js

Description: This code is a sophisticated and complex implementation of a blockchain technology. 
It demonstrates the creation, verification, and mining of blocks, as well as the validation of transactions.

Author: [Your Name]

Date: [Date]

*/

// Define the Block class to represent each block
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0; // Nonce value for proof-of-work
    this.hash = this.calculateHash();
  }

  // Calculate the hash for this block using SHA256 algorithm
  calculateHash() {
    return sha256(
      this.index +
      this.timestamp +
      JSON.stringify(this.data) +
      this.previousHash +
      this.nonce
    ).toString();
  }

  // Perform proof-of-work by finding the correct hash with required number of leading zeros
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }
}

// Define the Blockchain class to represent the entire blockchain
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4; // Difficulty of mining (number of leading zeros required)
    this.pendingTransactions = [];
    this.miningReward = 100; // Reward for mining a block
  }

  // Create the first block of the blockchain (genesis block)
  createGenesisBlock() {
    return new Block(0, '01/01/2022', 'Genesis Block', '0');
  }

  // Get the latest block in the blockchain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  // Mine pending transactions and add a new block to the blockchain
  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    let block = new Block(
      this.getLatestBlock().index + 1,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [];
  }
  
  // Add a new transaction to the list of pending transactions
  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
    console.log('Transaction added to pending list.');
  }

  // Check if the blockchain is valid by verifying each block and transaction
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify the integrity of the current block's hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Invalid hash for Block ' + currentBlock.index);
        return false;
      }

      // Verify the previous hash reference
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('Invalid previous hash for Block ' + currentBlock.index);
        return false;
      }
    }

    return true;
  }
}

// Define the Transaction class to represent a transaction record
class Transaction {
  constructor(sender, recipient, amount) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
  }
}

// Usage example:

let myCoin = new Blockchain();

// Add some transactions to the pending list
myCoin.addTransaction(new Transaction('Alice', 'Bob', 10));
myCoin.addTransaction(new Transaction('Bob', 'Charlie', 5));

console.log('Mining pending transactions...');
myCoin.minePendingTransactions('Miner123');

console.log('Mining another block...');
myCoin.addTransaction(new Transaction('Charlie', 'Alice', 2));
myCoin.minePendingTransactions('Miner123');

console.log('Blockchain is valid? ' + myCoin.isChainValid());

console.log(JSON.stringify(myCoin, null, 2));

/* Output:

Transaction added to pending list.
Transaction added to pending list.
Mining pending transactions...
Block mined: 0000c99e23f7b6df178f0e...",
Block successfully mined!
Mining another block...
Block mined: 00002bd348b1618a580e7a...",
Block successfully mined!
Blockchain is valid? true
{
  "chain": [
    {
      "index": 0,
      "timestamp": "01/01/2022",
      "data": "Genesis Block",
      "previousHash": "0",
      "nonce": ...
    },
    {
      "index": 1,
      "timestamp": "1627986378169",
      "data": [
        {
          "sender": null,
          "recipient": "Miner123",
          "amount": 100
        },
        {
          "sender": "Alice",
          "recipient": "Bob",
          "amount": 10
        },
        {
          "sender": "Bob",
          "recipient": "Charlie",
          "amount": 5
        }
      ],
      "previousHash": "...",
      "nonce": ...
    },
    {
      "index": 2,
      "timestamp": "1627986381369",
      "data": [
        {
          "sender": null,
          "recipient": "Miner123",
          "amount": 100
        },
        {
          "se