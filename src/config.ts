import * as dotenv from "dotenv";
dotenv.config();

export const rpcUrl = process.env.RPC_URL || "https://rpc.sepolia.org";
export const gatewayAddress = process.env.GATEWAY_ADDRESS || "";
export const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY || "";
export const pollIntervalMs = parseInt(process.env.POLL_INTERVAL_MS || "5000", 10);
