// this script executes when you run 'yarn test'
//
// you can also test remote submissions like:
// CONTRACT_ADDRESS=0x43Ab1FCd430C1f20270C2470f857f7a006117bbb yarn test --network rinkeby
//
// you can even run commands if the tests pass like:
// yarn test && echo "PASSED" || echo "FAILED"
//

const hre = require("hardhat");
const { ethers } = hre;
const { solidity } = require("ethereum-waffle");
const { use, expect } = require("chai");

use(solidity);

describe("Event", function () {
  let contract;

  //console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  let contractArtifact;
  if (process.env.CONTRACT_ADDRESS) {
  } else {
    contractArtifact = "contracts/Event.sol:Event";
  }

  it("Should deploy Event", async function () {
    const Event = await ethers.getContractFactory(contractArtifact);
    contract = await Event.deploy("", "", "", 1);
    expect(contract).not.to.equal(null);
  });
});
