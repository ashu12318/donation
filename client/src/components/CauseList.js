import React, {Component} from "react"
import Cause from "../dto/Cause"
import Utility from "../utility"
import DonationBox from "./DonationBox"
import { Table, Button } from 'rimble-ui';

class CauseList extends Component {
    constructor(props) {
        super(props);

        this.state = { web3: props.web3, account: props.account, causeFactoryContract: props.causeFactoryContract, causeContract: props.causeContract, causeAddresses: [], causes: [], cause: null };

        this.handleGetAllCauses = this.handleGetAllCauses.bind(this);
    }

    async loadCauses() {
        let causeFactoryContract = this.state.causeFactoryContract;
        causeFactoryContract.methods.GetAllCauses().call({ from: this.state.account }, this.handleGetAllCauses);
    }

    async handleGetAllCauses(error, addresses) {
        if (error) {
            alert("Error while loading cause list.");
            console.log("Error: handleGetAllCauses");
            console.log(error);
            return;
        }

        if (addresses === null || addresses.length === 0){
            return;
        }
        
        let web3 = this.state.web3;
        let account = this.state.account;
        let causeContract = this.state.causeContract;
        let causes = [];

        addresses.forEach((address) => {
            let cause = new Cause(address);
            causeContract.options.address = address;
            causeContract.methods.Title().call({ from: account}).then((title) => { 
                cause.title = title;
            });
            causeContract.methods.Details().call({ from: account}).then((detail) => { 
                cause.detail = detail;
            });
            causeContract.methods.TargetAmount().call({ from: account}).then((targetAmount) => { 
                cause.targetAmount = web3.utils.fromWei(targetAmount);
            });
            causeContract.methods.StartTime().call({ from: account}).then((startTime) => { 
                let startDate = new Date(startTime * 1000);
                cause.startTime = Utility.getDate(startDate);
            });
            causeContract.methods.EndTime().call({ from: account}).then((endTime) => { 
                let endDate = new Date(endTime * 1000);
                cause.endTime = Utility.getDate(endDate);
            });
            causeContract.methods.Owner().call({ from: account }).then((owner) => { 
                cause.owner = owner;
            });
            web3.eth.getBalance(address, function(error, balance) {
                cause.balance = web3.utils.fromWei(balance);
            });
            causes.push(cause);
        });

        setTimeout(() => {
            this.setState({ causeAddresses: addresses, causes: causes});
        }, 1000);
    }
    
    async showDonate(cause) {
        this.setState({ cause: cause});
    }

    async donate(causeAddress, amountInEther) {

        let web3 = this.state.web3;
        let account = this.state.account;
        let causeContract = this.state.causeContract;
        causeContract.options.address = causeAddress;

        let donationAmountInWei = web3.utils.toWei(amountInEther.toString());
        causeContract.methods.Donate().send( { from: account, value: donationAmountInWei } )
        .on("transactionHash", (transactionHash) => {
            console.log("Donate: Transaction Hash");
            console.log(transactionHash);
        })
        .on("receipt", (receipt) => {
            alert("Donation Done.");
            console.log("Donate: Receipt");
            console.log(receipt);

            this.props.refreshUserDetails();
            this.loadCauses();
        })
        .on("error", (error, receipt) => {
            //TODO: Formatting error message when something went wrong on blockchain
            alert("Something went wrong while withdrawing money.\n" + error.message); //This works when reject is done with metamask...
            console.log("Donate: Error");
            console.log(error);
        });
    }

    async withdraw(causeAddress) {
        let web3 = this.state.web3;
        let causeContract = this.state.causeContract;
        let account = this.state.account;
        let causes = this.state.causes;
        let cause = causes.find((cause) => {
            return cause.address == causeAddress;
        });

        let isOwner = cause.owner.toLowerCase() == account.toLowerCase(); 
        if(!isOwner) {
            alert("Only owners allowed to withdraw funds.");
            return;
        }

        causeContract.options.address = causeAddress;
        
        causeContract.methods.Withdraw().send( {from : account } )
        .on("transactionhash", function(transactionHash) {
            console.log("Withdraw: Transaction Hash");
            console.log(transactionHash);
        })
        .on("receipt", function(receipt) {
            this.props.refreshUserDetails();
            alert("Withdrawal Done.");
            console.log("Withdraw: Receipt");
            console.log(receipt);
        })
        .on("error", function(error, reciept) {
            //TODO: Formatting error message when something went wrong on blockchain
            alert("Something went wrong while withdrawing money.\n" + error.message);
            console.log("Withdraw: Error");
            console.log(error);
        });
    }

    render() {
        this.loadCauses();
        let causes = this.state.causes;
        let account = this.state.account;
        
        let causeDetails;
        if(causes === 'undefined' || causes == null || causes.length === 0)
        {
            causeDetails = <p>No Cause Created.</p>
        }
        else
        {
            causeDetails = causes.map((cause, index) => {
                let isOwner = cause.owner.toLowerCase() === account.toLowerCase();
                return(
                    <tr key={ index }>
                        <td>{ cause.title }</td>
                        <td>{ cause.detail }</td>
                        <td>{ cause.targetAmount }</td>
                        <td>{ cause.balance }</td>
                        <td>{ cause.startTime }</td>
                        <td>{ cause.endTime }</td>
                        <td><Button size="small" icon="Send" onClick={ () => this.showDonate(cause) }>Donate</Button></td>
                        <td>
                            {
                                isOwner && 
                                <Button size="small" onClick={ () => this.withdraw(cause.address) }>Withdraw</Button>
                            }
                        </td>
                    </tr>
                );
            });
        }
        return (
            <div>
                <Table className="CauseListTable">
                    <tbody>
                        <tr>
                            <td>
                                <Table>
                                    <thead>
                                        <tr style={ { alignContent: "center" }}>
                                            <th colSpan="8">
                                                <h1>Cause List</h1>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Cause Title</th>
                                            <th>Detail</th>
                                            <th>Target Amount</th>
                                            <th>Balance</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Donate</th>
                                            <th>Withdraw</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { causeDetails }
                                    </tbody>
                                </Table>
                            </td>
                            <td>
                                <DonationBox cause={ this.state.cause } donate={ (address, amountInEther) => this.donate(address, amountInEther)} ></DonationBox>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    };
}

export default CauseList;
