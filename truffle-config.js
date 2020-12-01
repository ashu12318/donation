require('dotenv').config()
const path = require("path");

const HDWalletProvider = require("@truffle/hdwallet-provider");

/*
const fs = require('fs'); //Alternate we can use dotenv npm pacakge to read .env file which can contain secret and api key
const mnemonic = fs.readFileSync(".secret").toString().trim();
*/

const mnemonic = process.env.MNEMONIC;
const infuraKey = process.env.INFURA_KEY;
const infuraURL = 'https://rinkeby.infura.io/v3/' + infuraKey

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, infuraURL)
      },
      network_id: 4
    }
  }
};
