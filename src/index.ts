import { startListening } from "./listener";
import { gatewayAddress } from "./config";

if (!gatewayAddress) {
  console.error("GATEWAY_ADDRESS not set in environment");
  process.exit(1);
}

console.log("fhish-relayer started on Sepolia");
startListening().catch(console.error);
