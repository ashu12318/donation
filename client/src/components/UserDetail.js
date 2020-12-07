import React, { Component } from "react";
import { Table, EthAddress } from 'rimble-ui';

class UserDetail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
       console.log("Rendering User Balance and Network");
        return(
            <div>
                <table style={{ width: "1200px" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "15%" }}>
                                <b>Network: { this.props.network } </b>
                            </td>
                            <td style={{ width: "65%" }}>
                                <b>Hello:</b> <label ><EthAddress address={ this.props.account } textLabels  /></label>
                            </td>
                            <td style={{ width: "20%" }}>
                                <h4>
                                    Balance: <label>{ this.props.userBalance } </label>
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