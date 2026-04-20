require('dotenv').config();
const { ethers } = require('ethers');
 
async function test() {
  console.log('🔍 DEBUG: PRIVATE_KEY length:', process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 'EMPTY');
  console.log('🔍 DEBUG: first 12 chars:', process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.slice(0,12) : 'EMPTY');
  
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY.length !== 66) {
    console.log('❌ ERROR: PRIVATE_KEY must be 66 chars (0x + 64 hex)');
    return;
  }
  
  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log('✅ Адрес:', wallet.address);
    const balance = await provider.getBalance(wallet.address);
    console.log('✅ Баланс:', parseFloat(ethers.formatEther(balance)).toFixed(4), 'ETH');
    console.log('🎉 WALLET OK!');
  } catch (error) {
    console.log('❌ Wallet error:', error.message);
    console.log('🔍 Raw key preview:', process.env.PRIVATE_KEY.slice(0,10) + '...');
  }
}
 
test();
