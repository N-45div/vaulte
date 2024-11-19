const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // USDE Token address (already deployed)
  const USDE_ADDRESS = "0x426E7d03f9803Dd11cb8616C65b99a3c0AfeA6dE";

  // Deploy Router
  const Router = await hre.ethers.getContractFactory("Router");
  const router = await Router.deploy();
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("Router deployed to:", routerAddress);

  // Deploy UserFactory
  const UserFactory = await hre.ethers.getContractFactory("UserFactory");
  const userFactory = await UserFactory.deploy(routerAddress, USDE_ADDRESS);
  await userFactory.waitForDeployment();
  const userFactoryAddress = await userFactory.getAddress();
  console.log("UserFactory deployed to:", userFactoryAddress);

  // Deploy PoolFactory
  const PoolFactory = await hre.ethers.getContractFactory("PoolFactory");
  const poolFactory = await PoolFactory.deploy(routerAddress, USDE_ADDRESS);
  await poolFactory.waitForDeployment();
  const poolFactoryAddress = await poolFactory.getAddress();
  console.log("PoolFactory deployed to:", poolFactoryAddress);

  // Set UserFactory in Router
  const setFactoryTx = await router.setFactory(userFactoryAddress);
  await setFactoryTx.wait();
  console.log("UserFactory set in Router");

  // Prepare deployment data
  const deploymentData = {
    network: hre.network.name,
    usde: USDE_ADDRESS,
    router: routerAddress,
    userFactory: userFactoryAddress,
    poolFactory: poolFactoryAddress,
    timestamp: new Date().toISOString(),
  };

  // Write deployment data to file
  const deploymentPath = path.join(
    deploymentsDir,
    `${hre.network.name}_deployment.json`
  );
  
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify(deploymentData, null, 2)
  );
  console.log(`Deployment addresses written to: ${deploymentPath}`);

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 