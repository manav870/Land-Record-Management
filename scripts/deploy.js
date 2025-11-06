const hre = require("hardhat");

/**
 * @dev Deployment script for LandRegistry contract
 * @notice This script deploys the LandRegistry contract to the network
 */
async function main() {
  console.log("Starting deployment of LandRegistry contract...\n");

  // Get the contract factory
  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  
  console.log("Deploying LandRegistry...");
  
  // Deploy the contract
  const landRegistry = await LandRegistry.deploy();
  
  // Wait for deployment to be mined
  await landRegistry.waitForDeployment();
  
  // Get the deployed contract address
  const contractAddress = await landRegistry.getAddress();
  
  console.log("\n✅ LandRegistry deployed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // Save deployment info (optional - for frontend use)
  console.log("📝 Save this information for your frontend:");
  console.log(`   Contract Address: ${contractAddress}`);
  console.log(`   Network: ${hre.network.name}\n`);
  
  // Verify deployment by calling a view function
  try {
    const totalLands = await landRegistry.getTotalLands();
    console.log("✅ Contract verification:");
    console.log(`   Total registered lands: ${totalLands}`);
    console.log("   Contract is working correctly!\n");
  } catch (error) {
    console.log("⚠️  Could not verify contract (this is normal on some networks)");
  }
  
  return {
    contractAddress,
    network: hre.network.name
  };
}

// Execute deployment
main()
  .then(() => {
    console.log("Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

