var Cause = artifacts.require("Cause");
var CauseFactory = artifacts.require("CauseFactory");

module.exports = function(deployer, network, accounts) {
  if (network == "test"  // While testing
      || network == "ganache") // While development
  {
    let startTime = Math.floor(Date.now() / 1000) + 2;
    let endTime = Math.floor(Date.now() / 1000) + 2000;
    deployer.deploy(Cause, "Covid Relief Fund", "A fund for relief measures for local businesses.", 100, startTime, endTime, accounts[0]);
  }
  deployer.deploy(CauseFactory);
};