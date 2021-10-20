import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import {Card, Grid, Button}  from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes';

class CampaignShow extends Component{

    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address: props.query.address
        };
    }

    renderCards(){
        const {
            balance,
            manager,
            minimumContribution,
            requestCount,
            approversCount
        } = this.props;
        const items = [
            {
                header:manager,
                meta:"Address of Manager",
                description:"Manager created this campaign and can create payment requests.",
                style:{overflowWrap:'break-word'}
            },
            {
                header:minimumContribution,
                meta:"Minimum Contribution",
                description:"Minimum amount you have to contribe in Wei",
                style:{overflowWrap:'break-word'}
            },
            {
                header:requestCount,
                meta:"Request Count",
                description:"No of pending requests.",
                style:{overflowWrap:'break-word'}
            },
            {
                header:approversCount,
                meta:"Approvers Count",
                description:"No of people who have Contributed.",
                style:{overflowWrap:'break-word'}
            },
            {
                header:web3.utils.fromWei(balance,'ether'),
                meta:"Balance",
                description:"Balance of the Campaign in Wei.",
                style:{overflowWrap:'break-word'}
            }
        ]
        return <Card.Group items={items}/>
    }
    render(){
        return (
            <Layout>
                <h3>Campaign Show!</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row> 
                        <Grid.Column>
                            <Link route={`/campaign/${this.props.address}/requests`}>
                                <a>
                                <Button primary>View requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
               
            </Layout>
        );
    }
}

export default CampaignShow;