import { useState } from 'react';

export default function DirectTest() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirectGoogleSheets = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('开始直接测试Google Sheets...');
      
      const url = "https://script.google.com/macros/s/AKfycbyn8MOU7baUKZ2exFQsLZD6hGs8poE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";
      
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" 
        },
        body: new URLSearchParams({ 
          email: email,
          source: 'direct-test',
          note: 'direct-browser-test',
          timestamp: new Date().toISOString()
        }),
        mode: 'cors',
      });

      console.log('响应状态:', response.status);
      const text = await response.text();
      console.log('响应内容:', text);
      
      setResult(`状态: ${response.status}\n响应: ${text}\n成功: ${text.includes('OK')}`);
    } catch (error) {
      console.error('直接请求错误:', error);
      setResult(`错误: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>直接测试Google Sheets</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="输入测试邮箱"
          style={{ 
            width: '300px', 
            padding: '10px', 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={testDirectGoogleSheets} 
          disabled={loading || !email}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? '测试中...' : '直接测试Google Sheets'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #dee2e6',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace'
        }}>
          <h3>测试结果:</h3>
          {result}
        </div>
      )}
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>说明:</h3>
        <p>这个页面直接从浏览器向Google Apps Script发送请求，绕过Next.js API代理。</p>
        <p>如果这个测试成功，说明Google Apps Script工作正常，问题在于API代理。</p>
        <p>如果这个测试失败，说明问题在于Google Apps Script配置。</p>
      </div>
    </div>
  );
}