const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const CampaignFactory= require('./build/CampaignFactory.json');

const provider = new HDWalletProvider('office double whip abandon enough donate photo suit pretty virtual kitten fall','https://rinkeby.infura.io/v3/b8c45e34bad74e299f4ec8b8c5cab179');
const web3 = new Web3(provider);

const deploy = async() =>{
    const accounts= await web3.eth.getAccounts();
    console.log('Attempting to deploy from the account',accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(CampaignFactory.interface))
        .deploy({data: CampaignFactory.bytecode})
        .send({gas:'1000000', from:accounts[0]});
    console.log("Contract deployed to ",result.options.address);
    //0x3f80Fc4EFF9DB003e5e44878F274A8f8D206096E

}
deploy();