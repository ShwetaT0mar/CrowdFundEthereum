import Web3 from 'web3';

let web3;
if(typeof window!=='undefined' && typeof window.ethereum!=='undefined'){
    //We are in the browser and metamask in running.
    window.ethereum.request({method: "eth_requestAccounts"});
    web3 = new Web3(window.ethereum);

}else{
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/b8c45e34bad74e299f4ec8b8c5cab179');
    web3 = new Web3(provider);

}

export default web3;