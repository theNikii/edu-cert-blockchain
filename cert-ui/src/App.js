import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import './App.css';

function App() {
  const [certHash, setCertHash] = useState('0x31c905b0ef826e96afc3458fc82d26f8dd19f07ec1a2f4de99914d98bb758536');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 EduCert Blockchain</h1>
        <p>Прототип ВКР: Безопасная верификация сертификатов</p>
        
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

        {result && (
          <div className={`result ${result.valid ? 'success' : 'error'}`}>
            <h2>{result.valid ? '✅ СЕРТИФИКАТ ВЕРИФИЦИРОВАН' : '❌ СЕРТИФИКАТ НЕ НАЙДЕН'}</h2>
            
            {result.success && (
              <>
                <div className="cert-details">
                  <p><strong>Хэш:</strong> {result.certHash}</p>
                  <p><strong>Издатель:</strong> {result.issuer}</p>
                  <p><strong>IPFS:</strong> {result.ipfsCid}</p>
                  <p><strong>Статус:</strong> {result.revoked ? 'Отозван' : 'Действующий'}</p>
                </div>
                
                {result.valid && (
                  <div className="qr-section">
                    <p>QR-код для проверки:</p>
                    <QRCodeSVG value={certHash} size={250} />
                    <p className="qr-hint">Сканируйте для мгновенной верификации</p>
                  </div>
                )}
              </>
            )}
            
            {result.error && (
              <p className="error-message">{result.error}</p>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
