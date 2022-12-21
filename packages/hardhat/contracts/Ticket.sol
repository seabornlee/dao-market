// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Ticket is ERC721 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;


  constructor() ERC721("Ticket NFT", "TNFT") {
  }

  function mintForCity(address owner, string memory city) public returns(uint256) {
    _tokenIdCounter.increment();
    uint256 tokenId = _tokenIdCounter.current();
    _safeMint(owner, tokenId);
    return tokenId;
  }

  function mintForEvent(address owner, uint256 eventId) public returns(uint256) {
    _tokenIdCounter.increment();
    uint256 tokenId = _tokenIdCounter.current();
    _safeMint(owner, tokenId);
    return tokenId;
  }
}
