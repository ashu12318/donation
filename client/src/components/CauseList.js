import React, {Component} from "react"
import Cause from "../dto/Cause"
import Utility from "../utility"

class CauseList extends Component {
    //TODO: Refresh on New Cause Create: Between two child component
    constructor(props) {
        super(props);

        this.state = { web3: props.web3, account: props.account, causeFactoryContract: props.causeFactoryContract, causeContract: props.causeContract, causeAddresses: [], causes: [] };

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
        
        let account = this.state.account;
        let causeContract = this.state.causeContract;
        let causes = this.state.causes;

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
                cause.targetAmount = targetAmount;
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
            causes.push(cause);
        });

        //TODO: Changes made in Cause object doesn't get reflected in UI: Fix this with more relible option
        setTimeout(() => {
            this.setState({ causeAddresses: addresses, causes: causes});
        }, 1000);
    }
    
    async donate(causeAddress) {
        //TODO: Get User Input on how much to donate
        //Perform Donation

    }

    async withdraw(causeAddress) {
        let causeContract = this.state.causeContract;
        let account = this.state.account;
        let causes = this.state.causes;
        let cause = causes.find((cause) => {
            return cause.address == causeAddress;
        });

        let isOwner = cause.owner.toLowerCase() == account.toLowerCase(); 
        if(!isOwner) {
            alert("Only owners allowed to withraw funds.");
            return;
        }

        causeContract.options.address = causeAddress;
        
        causeContract.methods.Withdraw().send( {from : account } )
        .on("transactionhash", function(transactionHash) {
            console.log("Transaction Hash");
            console.log(transactionHash);
        })
        .on("recepit", function(receipt) {
            alert("Withdrawal Done.");
            console.log("Receipt");
            console.log(receipt);
        })
        .on("error", function(error, reciept) {
            //TODO: Formatting error message when something went wrong on blockchain
            alert("Something went wrong while withdrawing money.\n" + error.message); //This works when reject is done with metamask...
            console.log("Error");
            console.log(error);
        });
        
        //TODO: Feedback to user upon successful withdrawal
    }

    //TODO - Design Cause List Item

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
                return(
                    <li key={index} title={ cause.address }>
                        <lable>{ cause.title }</lable> 
                        &nbsp;
                        <lable>{ cause.detail }</lable>
                        &nbsp;
                        <lable>{ cause.targetAmount }</lable>
                        &nbsp;
                        <lable>{ cause.startTime }</lable>
                        &nbsp;
                        <lable>{ cause.endTime }</lable>
                        <button onClick={ () => this.donate(cause.address) }>Donate</button>
                        <button onClick={ () => this.withdraw(cause.address) }>Withdraw</button>
                    </li>
                );
            });
        }
        return (
            <div>
                <h1>Cause List</h1>
                <ul>{ causeDetails }</ul>
            </div>
        );
    };
}

export default CauseList;
