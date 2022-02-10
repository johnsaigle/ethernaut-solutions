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
  const challengeFactory = await ethers.getContractFactory(`Shop`);
  // The below address comes from Ethernaut deployed on Rinkeby
  // Go to https://ethernaut.openzeppelin.com/, select a Level, grab address
  // from the URL
  const challengeAddress = await createChallenge(
    `0xBE732789f2963E0522719F2D3fB55E6bfe07e92e`,
    ethers.utils.parseEther(`1`)
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // Update this to match your attack contract
  const attackerFactory = await ethers.getContractFactory(`ShopAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
    // Note: this challange doesn't actually run successfully either for me or for
    // MrToph's original repo.
    // There is also a slight difference between the contract on the Ethernaut website
    // and the local version in this repository.
    // In any case I can't get it to run. Maybe this issue is caused by an old Solidity compiler?
    //
    // The vulnerability here is that there is a logic flaw in Shop. It allows us to 
    // create our own attacking contract that abuses the implicit trust that 
    // the SHop contract place in a Buyer contract.
    // In the function buy(), price is checked twice. This is a TOCTOU (time of check to time of use)
    // bug where we can modify the price() value in between the two calls and abuse the fact that the
    // isSold boolean has flipped from false to true.
    // The attacking contract's price() function changes its value depending on the state of the target
    // contract's isSold() function. When isSold() is false, it returns a value that is high enough
    // to check the comparison on line 14 of the Shop contract. When that check succeeds, isSold()
    // flips to true. Then when price() is called a second time, it returns a lower value so we can
    // get the item for less than the intended price.
    await attacker.attack();
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
