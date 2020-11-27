import React, { Component } from "react";
import CauseFactory from "./contracts/CauseFactory.json";
import getWeb3 from "./getWeb3";
//import { Button, Table } from "rimble-ui";
import CauseForm from "./components/CauseForm"

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      this.setState({ web3, accounts });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Create Cause</h1>
        <p>Create Cause</p>
        <CauseForm web3={this.state.web3} account={this.state.accounts[0]}>

        </CauseForm>
      </div>
    );
  }
}

export default App;
