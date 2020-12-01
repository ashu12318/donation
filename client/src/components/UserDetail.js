import React, { Component } from "react";
import { Table, EthAddress } from 'rimble-ui';

class UserDetail extends Component {
    constructor(props) {
        super(props);

        this.state = { balance: 0, account : props.account, networkName: "" };
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

        web3.eth.net.getNetworkType(function (error, name) {
            if (!error) {
                obj.setState({ networkName: name });
            }
        });

        return(
            <div>
                <table style={{ width: "1200px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "15%" }}>
                                <b>Network: { this.state.networkName } </b>
                            </td>
                            <td style={{ width: "65%" }}>
                                <b>Hello:</b> <label ><EthAddress address={ this.state.account } textLabels  /></label>
                            </td>
                            <td style={{ width: "20%" }}>
                                <h4>
                                    Balance: <label>{ this.state.balance } </label>
                                </h4>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

}

export default UserDetail;