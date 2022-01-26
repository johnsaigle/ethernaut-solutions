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
  const challengeFactory = await ethers.getContractFactory(`Vault`);
  const challengeAddress = await createChallenge(
    `0xf94b476063B6379A3c8b6C836efB8B3e10eDe188`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
    // This plaintext can be discovered by going to the Rinkeby chain on etherscan
    // and looking up the challengeAddress above.
    // You can review the bytecode and do a decompilation.
    // The decompiled source code contains the string below.
    const password = `A very strong secret password :)`;
    // Encode the string into a format that the blockchain can understand.
    await challenge.unlock(ethers.utils.toUtf8Bytes(password));
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
