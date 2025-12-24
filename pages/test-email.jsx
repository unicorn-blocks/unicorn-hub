import { useState } from 'react';

export default function TestEmail() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testSubmit = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const { submitEmailToGoogleSheets } = await import('../lib/googleSheets');
      const response = await submitEmailToGoogleSheets(email, 'test-page', 'test-submission');
      
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`错误: ${error.message}`);
    }
    
    setLoading(false);
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const url = "https://script.google.com/macros/s/AKfycbxtuVJytyiKr1EiA_8404XCIb7FMSh5pqE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";
      
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" 
        },
        body: new URLSearchParams({ 
          email: email,
          source: 'direct-test',
          note: 'direct-test-submission',
          timestamp: new Date().toISOString()
        }),
        mode: 'cors',
      });

      const text = await response.text();
      
      setResult(`状态: ${response.status}\n响应: ${text}`);
    } catch (error) {
      setResult(`直接请求错误: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Google Sheets 邮箱提交测试</h1>
      
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
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testSubmit} 
          disabled={loading || !email}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? '测试中...' : '使用API代理测试'}
        </button>
        
        <button 
          onClick={testDirectFetch} 
          disabled={loading || !email}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? '测试中...' : '直接请求测试'}
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
        <h3>调试步骤:</h3>
        <ol>
          <li>输入一个测试邮箱地址</li>
          <li>点击"使用工具函数测试"查看我们的代码是否工作</li>
          <li>点击"直接请求测试"查看是否是Google Apps Script的问题</li>
          <li>打开浏览器开发者工具(F12)查看Console中的详细错误信息</li>
        </ol>
      </div>
    </div>
  );
}