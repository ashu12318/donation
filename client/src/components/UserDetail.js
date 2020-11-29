import React, { Component } from "react"

class UserDetail extends Component {
    constructor(props) {
        super(props);

        this.state = { balance: 0, account : props.account };
    }

    render() {

        let web3 = this.props.web3;
        let account = this.state.account;
        let userBalance = 0;
        let obj = this;
        web3.eth.getBalance(account, function(error, balance) {
            userBalance = web3.utils.fromWei(balance);
            obj.setState({ balance: userBalance });
        });

        return(
            <div>
                Hello: <label>{ this.state.account }</label>
                Balance: <label>{ this.state.balance }</label>
            </div>
        );
    };

}

export default UserDetail;