require('dotenv').config({ path: '../.env' });
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Multer для загрузки PDF
const upload = multer({ dest: 'uploads/' });

// Ethereum провайдер и аккаунт
const provider = new ethers.JsonRpcProvider(
  process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'
);
const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

// ABI только для проверки (без IPFS)
const ABI = [
  "function verifyCertificate(bytes32 certHash) view returns (bool valid, address issuer, string ipfsCid, bool revoked)"
];

const contract = new ethers.Contract(
  '0x61c9C146892e5763365FD16f41504cBcB996E67C',
  ABI,
  provider
);

// Статус сервера
app.get('/status', (req, res) => {
  res.json({
    status: 'ready',
    network: 'Sepolia',
    contract: '0x61c9C146892e5763365FD16f41504cBcB996E67C'
  });
});

// Проверка сертификата по хэшу
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

// Эмулируем выпуск сертификата (без IPFS)
app.post('/issue', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.json({ success: false, error: 'No PDF file uploaded' });
  }

  try {
    // Здесь мог бы быть hash + IPFS CID...
    // Но пока просто возвращаем заглушку с hash
    const filename = req.file.originalname;
    const certHash = ethers.keccak256(
      ethers.toUtf8Bytes(`EDUCERT-${filename}-${Date.now()}`)
    );

    // Удаляем pdf из временной папки
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      certHash,
      ipfsCid: 'QmEduCert001_VKR_Diplom', // заглушка
      message: 'Certificate issued (IPFS integration not enabled)',
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Старт сервера
app.listen(4000, () => {
  console.log('🎓 EduCert API: http://localhost:4000');
  console.log('Endpoints:');
  console.log('GET  /status');
  console.log('GET  /verify/:certHash');
  console.log('POST /issue (multipart/form-data) [pdf file]');
});
