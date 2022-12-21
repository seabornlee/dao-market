// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "hardhat/console.sol";
import "./Event.sol";
import "./Ticket.sol";

contract Market {
  Ticket private ticketContract;
  Event private eventContract;

  mapping(address => uint256[]) private ownedEvents;

  Event[] private events;

  event EventCreated(uint256);
  event TicketMinted();

  constructor(address ticketContractAddress, address eventContractAddress) {
    ticketContract = Ticket(ticketContractAddress);
    eventContract = Event(eventContractAddress);
  }

  function createEvent() external {
    uint256 eventId = eventContract.mint(msg.sender);
    emit EventCreated(eventId);
  }

  function donate(uint256 _eventId, uint256 _amount) public payable {
    ticketContract.mintForCity(msg.sender, "");
    ticketContract.mintForEvent(msg.sender, _eventId);
    emit TicketMinted();
  }
}
