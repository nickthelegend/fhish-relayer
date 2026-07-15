# Fhish Relayer

**An off-chain relayer that watches an on-chain gateway for decryption requests, resolves encrypted vote handles, and posts the tally back on-chain.**

## Overview

Fhish Relayer is a lightweight TypeScript service that bridges an FHE-style
confidential-voting gateway contract with the outside world. When the gateway
emits a `DecryptionRequested` event (carrying a request ID plus encrypted "yes"
and "no" vote handles), the relayer decrypts those handles off-chain and calls
back into the contract with the resolved counts via `fulfillTally`.

This is an early V1: decryption is currently mocked (it reads the low bytes of a
ciphertext handle as the plaintext value) so the end-to-end request/response loop
can be exercised on the Sepolia testnet before a real FHE backend is wired in.

## Features

- **Event listener** — polls a Sepolia RPC endpoint on a fixed interval and
  queries for `DecryptionRequested` events since the last processed block,
  rewinding a few blocks on startup so nothing is missed.
- **Handle resolution** — a `compute` step turns each ciphertext handle into a
  plaintext vote count (mock FHE decryption in V1).
- **On-chain fulfillment** — signs and submits a `fulfillTally(requestId, yesVotes, noVotes)`
  transaction with the relayer wallet, then waits for confirmation.
- **Env-driven config** — RPC URL, gateway address, relayer key, and poll
  interval are all read from environment variables.

## Tech Stack

- **TypeScript** (ES2020, ts-node)
- **ethers.js v6** — provider, contract, and wallet interactions
- **dotenv** — environment configuration
- **Network:** Ethereum Sepolia testnet

## Getting Started

```bash
# clone
git clone https://github.com/nickthelegend/fhish-relayer.git
cd fhish-relayer

# install dependencies
npm install

# configure environment
cp .env.example .env
# then edit .env and set:
#   RPC_URL              Sepolia RPC endpoint
#   GATEWAY_ADDRESS      deployed gateway contract address (required)
#   RELAYER_PRIVATE_KEY  key that submits fulfillTally transactions
#   POLL_INTERVAL_MS     polling interval in ms (default 5000)

# run
npm run dev     # start with ts-node
npm run start   # same entry point
```

> Note: `.env` holds a funded relayer private key. Never commit it or reuse the
> placeholder key from `.env.example` on any real account.

## Project Structure

```
package.json        # scripts and dependencies
tsconfig.json       # TypeScript compiler config
.env.example        # sample environment configuration
relayer_start.txt   # captured startup log
src/
  index.ts          # entry point; validates config and starts the listener
  config.ts         # loads environment variables
  listener.ts       # polls for DecryptionRequested events and dispatches work
  compute.ts        # resolves a ciphertext handle to a plaintext count (mock FHE)
  responder.ts      # submits fulfillTally transactions to the gateway
```

---

Built by [**nickthelegend**](https://github.com/nickthelegend) · [nickthelegend.tech](https://nickthelegend.tech)
