const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data : compiledFactory.bytecode})
    .send({ from : accounts[0], gas:"1000000"});

    await factory.methods.createCampaign("100").send({
        from : accounts[0],
        gas : '1000000',
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe("Campaigns", ()=>{
    it("deploys factory and a campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it("marks caller as the manager", async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0] , manager);
    });

    it("allows people to contribute money and marks them as contributer ", async()=>{
        await campaign.methods.contribute().send({
            from : accounts[1],
            value : 150,
        })

        const isapprover = await campaign.methods.approvers(accounts[1]).call();
        assert.equal(true,isapprover)
    });

    it("requires a minimum contribution", async()=>{
        try{
            await campaign.methods.contribute().send({
                from : accounts[1],
                value : 5,
            })
            assert(false);

        }catch(err){
            assert(err);
        }
    });

    it("allows the manager to create a payment request", async()=>{
        await campaign.methods
        .createRequest("Buy batteries","100",accounts[5]).send({
            from : accounts[0],
            gas : '1000000',
        })

        const request = await campaign.methods.requests(0).call();
        assert.ok(request);
        assert.equal("Buy batteries",request.description);
    });

    it("processes request", async()=>{

        let startBalance = await web3.eth.getBalance(accounts[5]);
        startBalance = web3.utils.fromWei(startBalance,'ether');
        await campaign.methods.createRequest("Pay for elecricity",web3.utils.toWei('10','ether'),accounts[5]).send({
            from : accounts[0],
            gas : '1000000',
        });

        await campaign.methods.contribute().send({
            from : accounts[1],
            value : web3.utils.toWei('10','ether'),
        });

        await campaign.methods.contribute().send({
            from : accounts[2],
            value : web3.utils.toWei('5','ether'),
        });

        await campaign.methods.contribute().send({
            from : accounts[3],
            value : web3.utils.toWei('10','ether'),
        });

        await campaign.methods.approveRequest(0).send({
            from : accounts[1],
            gas : '1000000', 
        });

        await campaign.methods.approveRequest(0).send({
            from : accounts[2],
            gas : '1000000', 
        });
        
        await campaign.methods.finalizeRequest(0).send({
            from : accounts[0],
            gas  : "1000000",
        });

        let finalBalance = await web3.eth.getBalance(accounts[5]);
        finalBalance = web3.utils.fromWei(finalBalance,'ether');
        assert(10,parseFloat(finalBalance-startBalance));

    });

});