var Cause = artifacts.require("Cause");

module.exports = function(deployer, network) {
  if (network == "test"  // While testing
      || network == "ganache") // While development
  {
    let startTime = Math.floor(Date.now() / 1000) + 1000;
    let endTime = Math.floor(Date.now() / 1000) + 2000;
    deployer.deploy(Cause, "Covid Relief Fund", "A fund for relief measures for local businesses.", 100, startTime, endTime);
  }
};

