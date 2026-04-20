const { ethers } = require("hardhat");

async function main() {
  const certRegistryAddress = "0x..."; // из деплоя
  const certRegistry = await ethers.getContractAt("CertificateRegistry", certRegistryAddress);
  
  const certHash = ethers.keccak256(ethers.toUtf8Bytes("test-cert-123"));
  const ipfsCid = "QmTestCID";
  
  // Issue certificate
  const issueTx = await certRegistry.issueCertificate(certHash, ipfsCid);
  await issueTx.wait();
  
  // Verify
  const [valid, issuer, cid, revoked] = await certRegistry.verifyCertificate(certHash);
  console.log("Valid:", valid, "CID:", cid);
}

main();
