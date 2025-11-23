import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Get network
  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;

  console.log(`\nDeploying to network: ${network.name} (chainId: ${chainId})`);

  // USDC addresses
  const USDC_MAINNET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base mainnet
  const USDC_SEPOLIA = ""; // We'll deploy MockUSDC on Sepolia

  let usdcAddress: string;

  // Deploy MockUSDC on testnet, use real USDC on mainnet
  if (chainId === 84532n) { // Base Sepolia
    console.log("\n1. Deploying MockUSDC...");
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    usdcAddress = await mockUSDC.getAddress();
    console.log("MockUSDC deployed to:", usdcAddress);
  } else if (chainId === 8453n) { // Base mainnet
    usdcAddress = USDC_MAINNET;
    console.log("\n1. Using real USDC:", usdcAddress);
  } else {
    throw new Error("Unsupported network");
  }

  // Get backend signer address from env
  const signerAddress = process.env.BACKEND_SIGNER_ADDRESS;
  if (!signerAddress) {
    throw new Error("BACKEND_SIGNER_ADDRESS not set in .env");
  }

  console.log("\n2. Deploying NFTCollection...");
  console.log("   Backend signer:", signerAddress);
  console.log("   USDC address:", usdcAddress);

  const NFTCollection = await ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy(signerAddress, usdcAddress);
  await nftCollection.waitForDeployment();

  const nftAddress = await nftCollection.getAddress();
  console.log("NFTCollection deployed to:", nftAddress);

  // Wait for block confirmations before verification
  console.log("\nWaiting for block confirmations...");
  await nftCollection.deploymentTransaction()?.wait(5);

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", network.name);
  console.log("NFTCollection:", nftAddress);
  console.log("USDC:", usdcAddress);
  console.log("Backend Signer:", signerAddress);
  console.log("\n=== Next Steps ===");
  console.log("1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
  console.log("2. Update NEXT_PUBLIC_USDC_ADDRESS in .env.local");
  console.log(`3. Verify contract: npx hardhat verify --network ${network.name} ${nftAddress} ${signerAddress} ${usdcAddress}`);
  console.log("4. Set minting phase: await contract.setPhase(1) for whitelist or (2) for public");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

