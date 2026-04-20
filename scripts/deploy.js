import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)) + " ETH");
  
  // 1. IssuerRegistry
  const IssuerFactory = await ethers.getContractFactory("IssuerRegistry");
  const issuerRegistry = await IssuerFactory.deploy();
  await issuerRegistry.waitForDeployment();
  const issuerAddr = await issuerRegistry.getAddress();
  console.log("IssuerRegistry:", issuerAddr);
  
  // 2. CertificateRegistry
  const CertFactory = await ethers.getContractFactory("CertificateRegistry");
  const certRegistry = await CertFactory.deploy(issuerAddr);
  await certRegistry.waitForDeployment();
  const certAddr = await certRegistry.getAddress();
  console.log("CertificateRegistry:", certAddr);
  
  // 3. Add deployer as issuer
  const addTx = await issuerRegistry.addIssuer(deployer.address);
  await addTx.wait();
  console.log("✅ Deployer added as issuer!");
  
  console.log("\n🎉 PROTOTYPE DEPLOYED!");
  console.log(`ISSUER_REGISTRY=${issuerAddr}`);
  console.log(`CERT_REGISTRY=${certAddr}`);
}

main().catch((error) => {
  console.error("Deploy failed:", error);
  process.exit(1);
});
