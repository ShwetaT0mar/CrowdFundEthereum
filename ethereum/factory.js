import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x3f80Fc4EFF9DB003e5e44878F274A8f8D206096E'
    );

export default instance;
