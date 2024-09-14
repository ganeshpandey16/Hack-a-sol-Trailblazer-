const Messaging = artifacts.require("Messaging");

module.exports = function (deployer) {
  deployer.deploy(Messaging);
};