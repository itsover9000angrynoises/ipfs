const UserDetails = artifacts.require("./UserDetails.sol");
module.exports = async function(deployer) {
    await deployer.deploy(UserDetails);
};
