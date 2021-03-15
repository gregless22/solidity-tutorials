pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public participants;

    constructor() public {
        manager = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        participants.push(msg.sender);
    }

    // // Not really random
    function random() private view returns (uint256) {
        return uint256(sha3(block.difficulty, now, participants));
    }

    function pickWinner() public restricted {
        uint256 index = random() % participants.length;
        participants[index].transfer(this.balance);
        participants = new address[](0);
    }

    function getParticipants() public view returns (address[]) {
        return participants;
    }
}
