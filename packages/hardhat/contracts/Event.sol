// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Event is ERC721 {
  using Counters for Counters.Counter;

  Counters.Counter private _idCounter;

  constructor() ERC721("Event NFT", "ENFT") {
  }

  function mint(address owner) public returns (uint256) {
    _idCounter.increment();
    uint256 id = _idCounter.current();
    _mint(owner, id);
    return id;
  }

}
