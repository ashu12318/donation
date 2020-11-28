import React, { Component } from "react";
import CauseFactory from "./contracts/CauseFactory.json";
import Cause from "./contracts/Cause.json";
import getWeb3 from "./getWeb3";
//import { Button, Table } from "rimble-ui";
import CauseForm from "./components/CauseForm"
import CauseList from "./components/CauseList"

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, causeFactoryContract: null, causeContract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      let networkId = await this.getNetworkId(web3);
      let causeFactoryInstance = await this.getContractInstance(web3, networkId, CauseFactory);
      let causeInstance = await this.getContractInstance(web3, networkId, Cause);

      this.setState({ web3, accounts, causeFactoryContract: causeFactoryInstance, causeContract: causeInstance });

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

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {/* User Detail Section */}
        {/* Cause Form */}
        <div id="causeForm">
          <CauseForm 
            web3={this.state.web3}
            account={this.state.accounts[0]}
            causeFactoryContract={this.state.causeFactoryContract}>

          </CauseForm>
        </div>
        {/* Cause List */}
        <div id="causeList">
          <CauseList web3={this.state.web3}
            account={this.state.accounts[0]}
            causeFactoryContract={this.state.causeFactoryContract}
            causeContract={this.state.causeContract}>
            </CauseList>
        </div>
      </div>
    );
  }
}

export default App;
