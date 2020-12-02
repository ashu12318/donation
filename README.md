# Crypto Donation

# Overview
This Dapp aims to provide a way for anyone (with some ether at their disposal) to raise fund for any cause.
Users can browse from a catalog of Causes and whichever they feal appealing, and can donate to that cause using their crypto wallet.

This Dapp leverages the security and trustlessness of the best in class Etherium platform and highly secure wallet Metamask. 

Etherium platform is used for hosting and managing the donation logic and payments.

# The System
## Users & Stories
There are 2 end users of this Dapp and 1 Admin user  
**Cause Creator** - Any Person(Individual, Organization Representative) Raising the Money  
**Doner** - Person Donating the money to the cause  
**Admin** - Responsible for administration of this Smart Contract

## As a Cause Creator
* I can create a Cause with basic details such as a Title for cause, a breif description for it, its Start Date and End Date and Target Amount  
* I can withdraw funds once the timeline for accepting donation is over

## As a Doner
* I can Browse through the list of all causes present in the system  
* I can Donate Ether to any any of Cause for which Donation is being accepted

## As an Admin
* I can Enable or Disable Creation of new Cause (This feature will be used in case of emergency)

## Transactions and Read Operations
**There are total 4 transactions(Costs Ether) involved here:**  
* Create a Cause
* Donate to Cause
* Withdraw Funds
* Toggle Contract Status

**There are total 3 Read Operations involved here:**
* Fetch list of all the Causes
* Fetch User's Balance
* Fetch Cause's Balance


# Directory Structure
Project uses standard out-of-the-box project structure generated by Truffle Framework for Truffle-React-Box.  
Following is a breif explaination:  

* **Donation: Root Directory**
    - truffle-config.js : Network and truffle related configuration
    - README.md : Project's Readme
    - LICENSE : Project's License infomation
* **Donation/contracts**
    - Contains Smart Contracts of the System
* **Donation/migrations**
    - Migration files for Smart Contract Deployment
* **Donation/test**
    - Smart Contract Tests
* **Donation/client**
    - Frontend ReactJS code

# Build the Project
In order to build and run the project in your local you will need following minimum setup
1. Install Metamask extension to your fav browser [Download Link](https://metamask.io/download.html)
2. NodeJS(**v14.13.0**) and NPM(**6.14.8**) [Download Link](https://nodejs.org/download/release/v14.13.0/)

**Follow are the 2 ways to interact with this Dapp**  

### Connecting to Local Blockchain
In adition to the above two softwares you will need following additional setup  
1. Download the project repo(either as zip or clone it using git)
2. Install Ganache, a local blockchain network and configure a workspace with your mnemonic phrase same as used in Metamask account [Download Link](https://www.trufflesuite.com/ganache)
3. Deploying Smart Contract  
    1. Run Ganache: Ensure its running on port 7545
    2. Move to root directory of Project i.e. "Donation"
    3. [*Optional*] Compile it once to ensure everything is fine
        > truffle compile
    4. [*Optional*] Run tests to ensure Smart Contract is behaving as planned
        > tuffle test
    5. Deploy Smart Contract to Ganache (Reset flag will deploy contracts fresh)
        > truffle migrate --reset
4. Running front-end
    1. Move to "Donation/client" directory
    2. run the local development server from console/terminal
        > npm install
        > npm start
    3. This should launch the Dapp at "localhost:3000"
    4. Ensure you are connected to local blockchain network i.e. network id 5777 running at localhost:7545  
        Dapp will show you on top left corner, the network you are currently connected to.
    5. Start Interacting with Dapp

### Connecting to testnet(Rinkeby)
Currently Smart Contracts has been deployed to Rinkeby testnet.  
You can find the Smart Contract Rinkeby Address in "Donation/deploued_addresses.txt"  
1. Download the project repo(either as zip or clone it using git)
2. Running front-end
    1. Move to "Donation/client" directory
    2. run the local development server from console/terminal
        > npm install
        > npm start
    3. This should launch the Dapp at "localhost:3000"
    4. Ensure you are connected to Rinkeby blockchain network i.e. network id 4
        Dapp will show you on top left corner, the network you are currently connected to.
    5. Start Interacting with Dapp  
Note: Toggle Contract Status is only available to ME(:)) i.e. I am the admin for the contract deployed on Rinkeby network. You can also deploy your own version if you want to with additional work.

# Technology & Tools

## Crypto Wallet
* **Metamask**

## Backend
* **Etherium Platform:** Smart Contract and Fund Storage
* **Solidity:** Smart Contract Programming Language

## Frontend
* **ReactJS**
* **Javascript**
* **Web3JS:** Library to interact to etherium blockchain
* **rimble-ui:** Standard Dapp Controls

## Development Tools
* **Truffle Framework:** Development made easy
* **Ganache:** Local Blockchain Network
* **Visual Studio Code**

# Future Goals
- Accept Donation in Any Token: Uniswap/Metamask Integration
- Auto Swap to a Target stable coin
-- Add target Stable Coin token while creating Cause
- Upgradability
- Organization's Dashboard with all the causes