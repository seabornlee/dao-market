// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {

  ExampleExternalContract public exampleExternalContract;

  constructor(address exampleExternalContractAddress) {
      exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
  }

  bool internal openForWithdraw;

  mapping (address => uint256) public balances;

  uint256 internal _stakerCount;

  event Stake(address owner, uint256 amount);


  // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
  // ( Make sure to add a `Stake(address,uint256)` event and emit it for the frontend <List/> display )
  function stake() public payable {
    require(!exampleExternalContract.completed(), "Already completed.");

    if (balances[msg.sender] == 0) {
      _stakerCount++;
    }

    balances[msg.sender] += msg.value;


    emit Stake(msg.sender, msg.value);
  }


  function withdraw() public {
    require(openForWithdraw, "Not open for withdraw.");
    require(balances[msg.sender] > 0, "Not staked.");

    uint256 amount = balances[msg.sender];

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to send Ether.");
    balances[msg.sender] = 0;
  }

  function stakerCount() public view returns(uint256) {
    return _stakerCount;
  }


  // Add the `receive()` special function that receives eth and calls stake()
  receive() external payable {
    stake();
  }

}
