import React, { Component } from "react";
import CauseFactory from "./contracts/CauseFactory.json";
import Cause from "./contracts/Cause.json";
import getWeb3 from "./getWeb3";
import { Avatar, Button } from "rimble-ui";
import CauseForm from "./components/CauseForm"
import CauseList from "./components/CauseList"
import UserDetail from "./components/UserDetail"

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, causeFactoryContract: null, causeContract: null, refresh: {}};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("Account");
      console.log(accounts[0]);

      let networkId = await this.getNetworkId(web3);
      let causeFactoryInstance = await this.getContractInstance(web3, networkId, CauseFactory);
      let causeInstance = await this.getContractInstance(web3, networkId, Cause);

      this.setState({ web3, accounts, causeFactoryContract: causeFactoryInstance, causeContract: causeInstance });

      this.toggleContractStatus = this.toggleContractStatus.bind(this);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async getNetworkId(web3) {
    return await web3.eth.net.getId();
  }

  async getContractInstance(web3, networkId, contractJson) {
    const deployedNetwork = contractJson.networks[networkId];
    const contractInstance = new web3.eth.Contract(
      contractJson.abi,
      deployedNetwork && deployedNetwork.address,
    );
    return contractInstance;
  }

  async refreshUserDetails() {
    this.setState({ refresh: {} });
  }

  async toggleContractStatus() {
    let causeFactoryContract = this.state.causeFactoryContract;
    causeFactoryContract.methods.ToggleContractStatus().send({ from: this.state.accounts[0] })
    .on("transactionHash", (transactionHash) => {
      console.log("ToggleContractStatus: Transaction Hash: " + transactionHash);
    })
    .on("receipt", (receipt) => {
      console.log("ToggleContractStatus: Receipt");
      console.log(receipt);
      alert("Status toggled.");
    })
    .on("error", (error, receipt) => {
      console.log("ToggleContractStatus: Error");
      console.log(error);
      alert("Something went wrong while withdrawing money.\n" + error.message);
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {/* TODO: Show text based on contract status */}
        <div>
          <Button onClick={ () => this.toggleContractStatus() } >Toggle Contract Status</Button>
        </div>
        { /* User Detail Section */ }
        <div className="UserDetail">
          <UserDetail web3={ this.state.web3 } account={ this.state.accounts[0] } ></UserDetail>
        </div>

        { /* Cause Form */ }
        <div id="causeForm">
          <CauseForm 
            web3={ this.state.web3 }
            account={ this.state.accounts[0] }
            causeFactoryContract={ this.state.causeFactoryContract }
            refreshUserDetails={ () => this.refreshUserDetails() }
            >
          </CauseForm>
        </div>

        {/* Cause List */}
        <div id="causeList" className="CauseList">
          <CauseList web3={ this.state.web3 }
            account={ this.state.accounts[0] }
            causeFactoryContract={ this.state.causeFactoryContract }
            causeContract={ this.state.causeContract }
            refreshUserDetails={ () => this.refreshUserDetails() }
            >
            </CauseList>
        </div>
      </div>
    );
  }
}

export default App;
