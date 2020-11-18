//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Cause = artifacts.require("Cause");

module.exports = function(deployer) {
  deployer.deploy(Cause);
};
