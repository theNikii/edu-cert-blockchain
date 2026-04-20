const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const abi = [{"inputs":[{"internalType":"bytes32","name":"certHash","type":"bytes32"}],"name":"verifyCertificate","outputs":[{"internalType":"bool","name":"valid","type":"bool"},{"internalType":"address","name":"issuer","type":"address"},{"internalType":"string","name":"ipfsCid","type":"string"},{"internalType":"bool","name":"revoked","type":"bool"}],"stateMutability":"view","type":"function"}];
const contract = new ethers.Contract('0x61c9C146892e5763365FD16f41504cBcB996E67C', abi, provider);

async function test() {
  const certHash = '0xТВОЙ_HASH_ИЗ_КОНСОЛИ';
  const result = await contract.verifyCertificate(certHash);
  console.log('✅ Certificate verified:', result);
}

test();
