const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Account:", deployer.address);
  
  const IssuerRegistry = await hre.ethers.getContractFactory("IssuerRegistry");
  const issuerRegistry = await IssuerRegistry.deploy();
  await issuerRegistry.waitForDeployment();
  console.log("IssuerRegistry:", await issuerRegistry.getAddress());
  
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const certRegistry = await CertificateRegistry.deploy(await issuerRegistry.getAddress());
  await certRegistry.waitForDeployment();
  console.log("CertificateRegistry:", await certRegistry.getAddress());
}

main().catch(console.error);
