const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode} = require('./compile');

require('dotenv').config()
console.log(process.env);

// Using mnemonic of the trivial test wallet
// With Rinkeby ETH
const provider = new HDWalletProvider (
    process.env.MNEMONIC,
    'https://rinkeby.infura.io/v3/252414f1bc404f7593df941c97fa5683'
);

// This instance of web3 is for Rinkeby test network solely
const web3 = new Web3(provider);

// making it a function to use await
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy( { data: bytecode, arguments: ['Hi there!']})
        .send( {gas: '1000000', from: accounts[0]});

    //We need to record the 
    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};
deploy();
