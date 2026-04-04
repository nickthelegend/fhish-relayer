import { ethers } from "ethers";
import { rpcUrl, gatewayAddress, pollIntervalMs } from "./config";
import { compute } from "./compute";
import { respond } from "./responder";

let providerStr = rpcUrl;
const provider = new ethers.JsonRpcProvider(providerStr);

const gatewayAbi = [
  "event DecryptionRequested(uint256 indexed requestId, uint256 yesHandle, uint256 noHandle)"
];

export async function startListening() {
  const contract = new ethers.Contract(gatewayAddress, gatewayAbi, provider);

  console.log(`Watching gateway: ${gatewayAddress}`);
  
  let lastBlock = await provider.getBlockNumber();
  // Poll slightly in the past to catch any missed blocks during startup
  lastBlock = lastBlock - 5;

  setInterval(async () => {
    try {
      const latestBlock = await provider.getBlockNumber();
      if (latestBlock > lastBlock) {
        const events = await contract.queryFilter("DecryptionRequested", lastBlock + 1, latestBlock);
        for (const event of events) {
          // @ts-ignore
          const requestId = event.args.requestId;
          // @ts-ignore
          const yesHandle = event.args.yesHandle;
          // @ts-ignore
          const noHandle = event.args.noHandle;
          
          console.log(`Processing DecryptionRequest #${requestId}`);
          const yesVotes = compute(yesHandle);
          const noVotes = compute(noHandle);
          await respond(requestId, yesVotes, noVotes);
        }
        lastBlock = latestBlock;
      }
    } catch (e) {
      console.error("Poller error:", e);
    }
  }, pollIntervalMs);
}
