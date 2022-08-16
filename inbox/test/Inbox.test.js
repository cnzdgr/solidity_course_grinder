const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //We will always use its constructor, so capital
//We will use instances of Web3
const web3 = new Web3(ganache.provider()); //try the local test network
const { interface, bytecode } = require('../compile');

//Unlocked accounts are created by Ganache
//We can send/receive currency freely to these accounts

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!';

beforeEach(async () => {
    // Get a list of all accounts
    // For eth specifically
    // Nearly all web3 functions are promise
    accounts = await web3.eth.getAccounts();
    
    // Use one of those accounts to deploy
    // the contract
    // Accessing Contract constructor to deploy a new contract
    // And first we access ABI by parsing the JSON object 
    // That solc gives us
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        // to web3 deploy our contract with the 
        // given constructor arguments (1 to 1 mapping)
        .deploy({ data: bytecode, arguments: [INITIAL_STRING]})
        // Deploy does not deploy actually
        // The send function sends the contract to the chain
        .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', () => {
    it('deploys a contract', () =>{
        // If there is an address, it's probably OK
        // ok checks for truthy value
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        // methods contain all available methods of our contract
        // also we add .call() to call that function
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        // sending a transaction function
        // we are modifying
        // who is paying the gas is added as an argument
        // Also, we will get transaction hash, not the new message
        // This will fail if the code will not run anyways
        await inbox.methods.setMessage('bye').send( { from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});




