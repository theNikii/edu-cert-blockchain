import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import './App.css';

function App() {
  const [tab, setTab] = useState('verify'); // 'verify' или 'issue'
  const [certHash, setCertHash] = useState('0x31c905b0ef826e96afc3458fc82d26f8dd19f07ec1a2f4de99914d98bb758536');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  // Verify
  const verifyCertificate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/verify/${certHash}`);
      setResult(response.data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  // Issue new certificate
  const issueCertificate = async () => {
    if (!pdfFile) return alert('Выберите PDF файл');

    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await axios.post('http://localhost:4000/issue', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      setCertHash(response.data.certHash); // Переключаемся на verify
      setTab('verify');
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 EduCert Blockchain</h1>
        <p>Прототип ВКР: Безопасная система выдачи и верификации сертификатов</p>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={tab === 'verify' ? 'tab-active' : 'tab'} 
            onClick={() => setTab('verify')}
          >
            🔍 Верификация
          </button>
          <button 
            className={tab === 'issue' ? 'tab-active' : 'tab'} 
            onClick={() => setTab('issue')}
          >
            📄 Выпуск сертификата
          </button>
        </div>

        {tab === 'verify' && (
          <div className="tab-content">
            <div className="input-group">
              <input 
                value={certHash} 
                onChange={(e) => setCertHash(e.target.value)}
                placeholder="Введите hash сертификата (0x...)"
                className="cert-input"
              />
              <button 
                onClick={verifyCertificate} 
                disabled={loading}
                className="verify-btn"
              >
                {loading ? 'Проверяем...' : 'ПРОВЕРИТЬ'}
              </button>
            </div>
          </div>
        )}

        {tab === 'issue' && (
          <div className="tab-content">
            <div className="input-group">
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="file-input"
              />
              <button 
                onClick={issueCertificate} 
                disabled={loading || !pdfFile}
                className="issue-btn"
              >
                {loading ? 'Выпускаем...' : 'ВЫПУСТИТЬ СЕРТИФИКАТ'}
              </button>
            </div>
            {pdfFile && <p>✅ Выбран: {pdfFile.name}</p>}
          </div>
        )}

        {result && (
          <div className={`result ${result.success && result.valid ? 'success' : result.success ? 'issued' : 'error'}`}>
            <h2>
              {result.success && result.valid 
                ? '✅ СЕРТИФИКАТ ВЕРИФИЦИРОВАН' 
                : result.success && result.certHash 
                  ? '🎉 СЕРТИФИКАТ ВЫПУЩЕН!' 
                  : '❌ ОШИБКА'}
            </h2>
            
            {result.success && (
              <>
                <div className="cert-details">
                  <p><strong>Хэш:</strong> {result.certHash || 'Создан'}</p>
                  <p><strong>Издатель:</strong> {result.issuer || 'Текущий аккаунт'}</p>
                  <p><strong>IPFS:</strong> {result.ipfsCid}</p>
                  <p><strong>TX:</strong> <a href={`https://sepolia.etherscan.io/tx/${result.txHash}`} target="_blank">{result.txHash}</a></p>
                </div>
                
                {(result.valid || result.certHash) && (
                  <div className="qr-section">
                    <p>QR‑код для проверки:</p>
                    <QRCodeSVG value={result.certHash || certHash} size={250} />
                  </div>
                )}
              </>
            )}
            
            {result.error && <p className="error-message">{result.error}</p>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
