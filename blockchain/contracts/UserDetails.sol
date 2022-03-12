pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

contract UserDetails {
    uint256 userId;
    mapping(uint256 => string) userDetailsMapping;

    constructor() {
        userId = 0;
        userDetailsMapping[userId] = "empty";
        userId++;
    }

    function addUserDetails(string memory _userDetailsHash)
        public
        returns (bool)
    {
        userDetailsMapping[userId] = _userDetailsHash;
        userId++;
        return true;
    }

    function getUserDetails(uint256 _userId)
        public
        view
        returns (string memory)
    {
        return userDetailsMapping[_userId];
    }
}
