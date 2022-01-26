# ethernaut-solutions

Solutions to [Ethernaut CTF](https://ethernaut.openzeppelin.com/)/LiftTicket for Avax.

The unit-test solution format is based on the work done by [MrToph](https://github.com/MrToph)
Check out his work! His blog posts helped me to get started with smart contract
auditing. This repository uses unit tests instead of cloning Ethernaut as-is.
For a beginner, this greatly simplifies the deployment and build process.

## Development

```bash
npm i
```

You need to configure environment variables:

```bash
cp .env.template .env
# fill out
```

Pick a mnemonic and the resulting accounts will be used in the challenges.

#### Hardhat

This repo uses [hardhat](https://hardhat.org/) to run the CTF challenges.
Challenges are implemented as hardhat tests in [`/test`](./test).

The tests run on a local hardnet network but it needs to be forked from Rinkeby because it interacts with the challenge factory and submission contract.
To fork the Rinkeby testnet, you need an archive URL like the free ones from [Alchemy](https://alchemyapi.io/).

#### Running challenges

Optionally set the block number in the `hardhat.config.ts` hardhat network configuration to the rinkeby head block number such that the challenge contract is deployed.

```bash
# fork rinkeby but run locally
npx hardhat test test/0-hello.ts
```
