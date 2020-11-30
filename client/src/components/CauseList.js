import React, {Component} from "react"
import Cause from "../dto/Cause"
import Utility from "../utility"
import DonationBox from "./DonationBox"

class CauseList extends Component {
    constructor(props) {
        super(props);

        this.state = { web3: props.web3, account: props.account, causeFactoryContract: props.causeFactoryContract, causeContract: props.causeContract, causeAddresses: [], causes: [], cause: null };

        this.handleGetAllCauses = this.handleGetAllCauses.bind(this);
    }

    componentDidMount = async () => {
        await this.loadCauses();
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

        if (addresses == null || addresses.length == 0){
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

        //TODO: Changes made in Cause object doesn't get reflected in UI: Fix this with more relible option
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
            console.log("Transaction Hash");
            console.log(transactionHash);
        })
        .on("receipt", (receipt) => {
            alert("Donation Done.");
            console.log("Receipt");
            console.log(receipt);

            this.props.refreshUserDetails();
            this.loadCauses();
        })
        .on("error", (error, receipt) => {
            //TODO: Formatting error message when something went wrong on blockchain
            alert("Something went wrong while withdrawing money.\n" + error.message); //This works when reject is done with metamask...
            console.log("Error");
            console.log(error);
        });
    }

    async withdraw(causeAddress) {
        //TODO: Fix the issue with withdrawal: Even the fund is there, its showing funds withdrawn
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
            console.log("Transaction Hash");
            console.log(transactionHash);
        })
        .on("receipt", function(receipt) {
            this.props.refreshUserDetails();
            alert("Withdrawal Done.");
            console.log("Receipt");
            console.log(receipt);
        })
        .on("error", function(error, reciept) {
            //TODO: Formatting error message when something went wrong on blockchain
            alert("Something went wrong while withdrawing money.\n" + error.message);
            console.log("Error");
            console.log(error);
        });
    }

    render() {
        let causes = this.state.causes;
        let account = this.state.account;
        
        let causeDetails;
        if(causes == null || causes.length === 0)
        {
            causeDetails = <p>No Cause Created.</p>
        }
        else
        {
            causeDetails = causes.map((cause, index) => {
                let isOwner = cause.owner.toLowerCase() == account.toLowerCase();
                return(
                    <li key={ index } title={ cause.address }>
                        <lable>{ cause.title }</lable> 
                        &nbsp;
                        <lable>{ cause.detail }</lable>
                        &nbsp;
                        <lable>Target: { cause.targetAmount } Ether</lable>
                        &nbsp;
                        <lable>Bal: { cause.balance } Ether</lable>
                        &nbsp;
                        <lable>{ cause.startTime }</lable>
                        &nbsp;
                        <lable>{ cause.endTime }</lable>
                        &nbsp;
                        <button onClick={ () => this.showDonate(cause) }>Donate</button>
                        {
                            isOwner && 
                            <button onClick={ () => this.withdraw(cause.address) }>Withdraw</button>
                        }
                    </li>
                );
            });
        }
        return (
            <div>
                <h1>Cause List</h1>
                <ul>{ causeDetails }</ul>
                <br />
                <DonationBox cause={ this.state.cause } donate={ (address, amountInEther) => this.donate(address, amountInEther)} ></DonationBox>
            </div>
        );
    };
}

export default CauseList;
