// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "hardhat/console.sol";
import "./Event.sol";

contract Market {

  mapping(address => uint256[]) private ownedEvents;

  Event[] private events;

  function eventsOf(address owner) public view returns (uint256[] memory) {
    return ownedEvents[owner];
  }

  function createEvent(string memory _name, string memory _description, string memory _homepage, uint256 _targetFund) public returns(uint256) {
    Event e = new Event(_name, _description, _homepage, _targetFund);
    events.push(e);
    uint id = events.length - 1;
    ownedEvents[msg.sender].push(id);
  }
}
