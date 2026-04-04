import { ethers } from "ethers";
import { rpcUrl, gatewayAddress, relayerPrivateKey } from "./config";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(relayerPrivateKey, provider);

const gatewayAbi = [
  "function fulfillTally(uint256 requestId, uint32 yesVotes, uint32 noVotes) external"
];

export async function respond(requestId: bigint, yesVotes: number, noVotes: number) {
  const contract = new ethers.Contract(gatewayAddress, gatewayAbi, wallet);
  console.log(`Fulfilling request ID ${requestId} with yes=${yesVotes}, no=${noVotes}...`);
  try {
    const tx = await contract.fulfillTally(requestId, yesVotes, noVotes, {
      gasLimit: 300000 // Ensure enough gas for Sepolia
    });
    console.log(`Wait for confirmation: ${tx.hash}`);
    await tx.wait();
    console.log(`Fulfilled request ID ${requestId}, tx: ${tx.hash}`);
  } catch (e: any) {
    console.error(`Fulfillment failed for requestId ${requestId}:`, e.message);
  }
}
