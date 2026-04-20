require('dotenv').config({ path: '../.env' });
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org');
const ABI = [
  "function verifyCertificate(bytes32 certHash) view returns (bool valid, address issuer, string ipfsCid, bool revoked)"
];
const contract = new ethers.Contract(
  '0x61c9C146892e5763365FD16f41504cBcB996E67C',
  ABI,
  provider
);

app.get('/verify/:certHash', async (req, res) => {
  try {
    const result = await contract.verifyCertificate(req.params.certHash);
    res.json({
      success: true,
      certHash: req.params.certHash,
      valid: result[0],
      issuer: result[1],
      ipfsCid: result[2],
      revoked: result[3]
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get('/status', (req, res) => {
  res.json({ 
    status: 'ready', 
    contract: '0x61c9C146892e5763365FD16f41504cBcB996E67C',
    certHash: '0x31c905b0ef826e96afc3458fc82d26f8dd19f07ec1a2f4de99914d98bb758536'
  });
});

app.listen(4000, () => {
  console.log('🎓 EduCert API: http://localhost:4000');
  console.log('✅ Тест: curl http://localhost:4000/status');
});
