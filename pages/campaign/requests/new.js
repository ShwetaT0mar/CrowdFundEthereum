import React, { Component } from 'react';
import {Form , Button, Input, Message} from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import Layout from '../../../components/Layout';
import {Link, Router} from '../../../routes';

class RequestNew extends Component{
    state={
        description: "",
        amount: "",
        recipientAddress: "",
        loading: false,
        errorMessage: ""
    };
    static async getInitialProps(props){
        const {address} = props.query;
        return {address};
    }

    submitNewRequest=async (event) => {
        event.preventDefault();

        this.setState({loading:true, errorMessage:""});

        const campaign = Campaign(this.props.address);
        const {description, amount, recipientAddress} = this.state;

        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(description, web3.utils.toWei(amount,'ether'), recipientAddress)
                .send({from: accounts[0]});
            Router.pushRoute(`/campaign/${this.props.address}/requests`)
        }catch(err){
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false})
    }
    renderNewRequest(){
        return(
            <Form onSubmit={this.submitNewRequest} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={this.state.description}
                        onChange={(event)=>{this.setState({description: event.target.value})}}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Amount</label>
                    <Input
                        value={this.state.amount}
                        onChange={(event)=>{this.setState({amount: event.target.value})}}
                        label = 'ether'
                        labelPosition ='right'
                    />
                </Form.Field>
                <Form.Field>
                    <label>recipientAddress</label>
                    <Input
                        value={this.state.recipientAddress}
                        onChange={(event)=>{this.setState({recipientAddress: event.target.value})}}
                    />
                </Form.Field>
                <Button primary loading={this.state.loading}>Submit Request</Button>
                <Message error header="Oops!" content={this.state.errorMessage} />

            </Form>
        );
    }
    render(){
        return (
            <Layout>
                <Link route={`/campaign/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                {this.renderNewRequest()}
            </Layout>
        );
    }
}

export default RequestNew;