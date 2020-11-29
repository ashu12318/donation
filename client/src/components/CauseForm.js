import React, { Component } from "react";
import "../App.css";

class CauseForm extends Component {

    constructor(props) {
        super(props);

        this.state = { web3: props.web3, account: props.account, causeFactory: props.causeFactoryContract, title: "", detail: "", targetAmount: 0.0, startTime: "", endTime: "" };
        
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDetailChange = this.handleDetailChange.bind(this);
        this.handleTargetAmountChange = this.handleTargetAmountChange.bind(this);
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value });
    }

    handleDetailChange(e) {
        this.setState({ detail: e.target.value });
    }

    handleTargetAmountChange(e) {
        this.setState({ targetAmount: parseFloat(e.target.value) });
    }

    handleStartTimeChange(e) {
        this.setState({ startTime: e.target.value });
    }

    handleEndTimeChange(e) {
        this.setState({ endTime: e.target.value });
    }

    validateState() {
        if (!this.state.title) {
            return "Please provide value for title.";
        }
        else if(!this.state.detail) {
            return "Please provide value for detail.";
        }
        else if(this.state.targetAmount == null || isNaN(this.state.targetAmount) || this.state.targetAmount <= 0) {
            return "Please provide positive value for target amount.";
        }
        else if(!this.state.startTime) {
            return "Please provide start time.";
        }
        else if(!this.state.endTime) {
            return "Please provide end time.";
        }
        
        let today = new Date();
        let startTime = new Date(this.state.startTime);
        let endTime = new Date(this.state.endTime);

        if(today > startTime) {
            return "Start Time should be a future date.";
        }
        if(endTime <= startTime) {
            return "End Time should be a future date and should be after Start Date.";
        }
        
        return null;
    }

    handleSubmit(e) {
        let errorMessage = this.validateState();
        if(errorMessage) {
            alert(errorMessage);
            e.preventDefault();
            return;
        }
        
        //Sending transaction to Cause Factory Contract
        let web3 = this.state.web3;
        let causeFactory = this.state.causeFactory;
        let startTime = new Date(this.state.startTime).getTime() / 1000;
        let endTime = new Date(this.state.endTime).getTime() / 1000;
        let targetAmount = web3.utils.toWei(this.state.targetAmount.toString());

        causeFactory.methods.CreateCause(this.state.title, this.state.detail, targetAmount, startTime, endTime)
        .send({ from: this.state.account })
        .on("transactionHash", function(transactionHash) {
            console.log("Transaction Hash");
            console.log(transactionHash);
        })
        .on("receipt", function(receipt) {
            alert("Cause created.");
            console.log("Receipt");
            console.log(receipt);
            
            this.props.refreshUserDetails(); //TODO: Why create cause is not refreshing user details?
        })
        .on("error", function(error, receipt) {
            alert("Something went wrong while creating cause..\n" + error.message);
            console.log("Error");
            console.log(error);
        });

        e.preventDefault();
    };

    render() {
        return (
            <div>
                <h1>Create Cause</h1>
                <form onSubmit={this.handleSubmit}>
                    <table>
                        <tr>
                            <td>
                                <label for="title">Title:</label>
                            </td>
                            <td>
                                <input id="title" type="text"
                                    value={this.state.title}
                                    onChange={this.handleTitleChange}
                                    maxLength="10"
                                    placeholder="Max 10 characters"
                                >
                                </input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="detail">Detail:</label>
                            </td>
                            <td>
                                <input id="detail" type="text"
                                    value={this.state.detail}
                                    onChange={this.handleDetailChange}
                                    maxLength="100"
                                    placeholder="Max 100 characters"
                                >
                                </input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="targetAmount">Target Amount(Ether):</label>
                            </td>
                            <td>
                                <input id="targetAmount" type="number"
                                    value={this.state.targetAmount}
                                    onChange={this.handleTargetAmountChange}
                                    placeholder="In Ether"
                                    min="0" step="0.00001"
                                >
                                </input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="startTime">Start Time:</label>
                            </td>
                            <td>
                                <input id="startTime" type="date"
                                    value={this.state.startTime}
                                    onChange={this.handleStartTimeChange}
                                >
                                </input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="endTime">End Time:</label>
                            </td>
                            <td>
                                <input id="endTime" type="date"
                                    value={this.state.endTime}
                                    onChange={this.handleEndTimeChange}
                                >
                                </input>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="center">
                                <input type="submit" value="CREATE"></input>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        );
    };
}

export default CauseForm;