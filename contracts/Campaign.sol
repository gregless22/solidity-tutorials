// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Campaign {
    address public manager;
    uint256 public minimumContribution;
    address[] public approvers;

    constructor(uint256 m) public {
        manager = msg.sender;
        minimumContribution = m;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers.push(msg.sender);
    }
}
