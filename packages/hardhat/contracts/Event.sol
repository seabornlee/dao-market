// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "@openzeppelin/contracts/utils/Counters.sol";

contract Event {
  using Counters for Counters.Counter;

  Counters.Counter private _idCounter;

  string internal name;
  string internal description;
  string internal homepage;
  uint256 internal targetFund;

  constructor(string memory _name, string memory _description, string memory _homepage, uint256 _targetFund) public {
    _idCounter.increment();
    uint256 id = _idCounter.current();

    name = _name;
    description = _description;
    homepage = _homepage;
    targetFund = _targetFund;
  }

}
