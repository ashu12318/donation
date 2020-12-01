import React, {Component} from 'react'
import { Button, Input, Field } from 'rimble-ui'
import Cause from '../dto/Cause'

class DonationBox extends Component {
    
    constructor(props) {
        super(props);
        this.state = { donationAmount: 0 };
        this.donate = this.donate.bind(this);
        this.handleDonationAmountChange = this.handleDonationAmountChange.bind(this);
    }

    async handleDonationAmountChange(e) {
        this.setState({ donationAmount: parseFloat(e.target.value) });
    }

    async donate() {
        let donationAmountInEther = this.state.donationAmount;
        let cause = this.props.cause;
        this.props.donate(cause.address, donationAmountInEther);
    }

    render() {
        let cause = this.props.cause;
        if (!cause) {
            return null;
        }
        return (
            <div>
                <h3>Donate For:</h3>
                <label>{ cause.title }({ cause.detail })</label>
                <br/>
                <label>Target: { cause.targetAmount }</label>
                <br/>
                <Input id="donationAmount" type="number" 
                    min="0" step="0.000001" placeholder="Amount in Ether" 
                    value={ this.state.donationAmount } 
                    onChange={this.handleDonationAmountChange}
                    />
                <Button onClick={ () => this.donate() } icon="Send">Donate</Button>
            </div>
        );
    }
}

export default DonationBox;