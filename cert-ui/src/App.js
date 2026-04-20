import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import './App.css';

function App() {
  const [tab, setTab] = useState('verify');
  const [hash, setHash] = useState(
    '0x31c905b0ef826e96afc3458fc82d26f8dd19f07ec1a2f4de99914d98bb758536'
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  // Проверка сертификата
  const verify = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/verify/${hash}`);
      setResult(response.data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  // Выпуск нового сертификата
  const issue = async () => {
    if (!pdfFile) return alert('Выберите PDF файл');

    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await axios.post(
        'http://localhost:4000/issue',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setResult(response.data);
      setHash(response.data.certHash);
      setTab('verify');
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  // Константа (это не функция, JSX должен быть возвращён из App)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'verify') verify();
    if (tab === 'issue') issue();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 EduCert Blockchain</h1>

        {/* Tabs: Verify / Issue */}
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

        {/* Форма для выбранного таба */}
        <form onSubmit={handleSubmit}>
          {tab === 'verify' && (
            <div className="input-group">
              <input
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="0x..."
                className="cert-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="verify-btn"
              >
                {loading ? 'Проверяем...' : 'ПРОВЕРИТЬ'}
              </button>
            </div>
          )}

          {tab === 'issue' && (
            <div className="input-group">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="file-input"
              />
              <button
                type="submit"
                disabled={loading || !pdfFile}
                className="issue-btn"
              >
                {loading ? 'Выпускаем...' : 'ВЫПУСТИТЬ'}
              </button>
            </div>
          )}
        </form>

        {/* Отображение результата */}
        {result && (
          <div
            className={`result ${
              result.success && (result.valid || result.certHash) 
                ? 'success' 
                : 'error'
            }`}
          >
            <h2>
              {result.success && result.valid
                ? '✅ СЕРТИФИКАТ ВЕРИФИЦИРОВАН'
                : result.success && result.certHash
                  ? '🎉 СЕРТИФИКАТ ВЫПУЩЕН!'
                  : '❌ ОШИБКА'}
            </h2>

            {result.success && (
              <>
                <p>Hash: {result.certHash}</p>
                {result.issuer && <p>Издатель: {result.issuer}</p>}
                <p>IPFS: {result.ipfsCid}</p>
                {result.explorer && (
                  <p>
                    <a href={result.explorer} target="_blank" rel="noreferrer">
                      Транзакция в Etherscan
                    </a>
                  </p>
                )}
              </>
            )}

            {result.error && (
              <p className="error-message">{result.error}</p>
            )}
          </div>
        )}

        {/* QR-код когда есть hash */}
        {result && result.certHash && (
          <div className="qr-section">
            <p>QR-код для проверки:</p>
            <QRCodeSVG value={result.certHash} size={250} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
