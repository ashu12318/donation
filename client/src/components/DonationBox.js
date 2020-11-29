import React, {Component} from 'react'

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
                <label>{ cause.title }</label>
                <br/>
                <label>{ cause.detail }</label>
                <br/>
                <label>{ cause.targetAmount }</label>
                <br/>
                {/* TODO: Put some style or icon for ether */}
                <input id="donationAmount" type="number" 
                    min="0" step="0.000001" placeholder="Amount in Ether" 
                    value={ this.state.donationAmount } 
                    onChange={this.handleDonationAmountChange}
                    />
                <button onClick={ () => this.donate() }>Donate</button>
            </div>
        );
    }
}

export default DonationBox;