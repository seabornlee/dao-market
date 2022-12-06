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

describe("Ticket", function () {


  let ticketContract;

  //console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  describe("Ticket", function () {
    let contractArtifact;
    if (process.env.CONTRACT_ADDRESS) {
    } else {
      contractArtifact = "contracts/Ticket.sol:Ticket";
    }

    it("Should deploy Ticket", async function () {
      const Ticket = await ethers.getContractFactory(contractArtifact);
      ticketContract = await Ticket.deploy();
    });

    describe("Speaker", function () {
      async function mint() {
        const result = await ticketContract.mint()

        console.log('\t'," ⏳  Waiting for confirmation...")
        const txResult =  await result.wait()
        expect(txResult.status).to.equal(1, "Error while awaiting mint confirmation");

        return txResult.events[0].args[2].toNumber()
      }

      it("Should mint NFT with id increased automatically", async function () {
        const [ owner ] = await ethers.getSigners();

        let id = await mint();
        expect(id).to.equal(1);

        id = await mint();
        expect(id).to.equal(2);
      });
    });
  });
});
