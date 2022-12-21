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

describe("Market", function () {


  let contract;

  //console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  let contractArtifact;
  if (process.env.CONTRACT_ADDRESS) {
  } else {
    contractArtifact = "contracts/Market.sol:Market";
  }

  async function createEvent() {
    const result = await contract.createEvent();


    console.log('\t'," ⏳  Waiting for confirmation...")
    const txResult = await result.wait()
    expect(txResult.status).to.equal(1, "Error while awaiting mint confirmation");
    return txResult.events[1].args[0];
  }

  it("Should deploy Market", async function () {
    const TicketContract = await ethers.getContractFactory("Ticket");
    const ticketContract = await TicketContract.deploy();

    const EventContract = await ethers.getContractFactory("Event");
    const eventContract = await EventContract.deploy();

    const Market = await ethers.getContractFactory(contractArtifact);
    contract = await Market.deploy(ticketContract.address, eventContract.address);
  });

  it("Should create an event", async function () {
    const [ owner ] = await ethers.getSigners();
    let id = await createEvent();
    expect(id).to.equal(1);
  });

  it("Should get 2 NFTs when donate", async function() {
    const [ owner ] = await ethers.getSigners();

    const eventId = await createEvent();
    await expect(contract.donate(eventId, 15))
      .to.emit(contract, "TicketMinted");
  });

  it('Donate', () => {
    it('Should increase balance', () => {

    });
    it('Should find event by id', () => {

    });

  });
});
