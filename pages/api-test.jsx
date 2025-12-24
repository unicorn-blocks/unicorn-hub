import { useState } from 'react';

export default function ApiTest() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiDirect = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('开始测试API代理...');
      
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'api-test',
          note: 'direct-api-test'
        }),
      });

      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API响应数据:', data);
      
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('API测试错误:', error);
      setResult(`错误: ${error.message}`);
    }
    
    setLoading(false);
  };

  const testToolFunction = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('开始测试工具函数...');
      
      const { submitEmailToGoogleSheets } = await import('../lib/googleSheets');
      const response = await submitEmailToGoogleSheets(email, 'tool-test', 'tool-function-test');
      
      console.log('工具函数响应:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('工具函数测试错误:', error);
      setResult(`错误: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>API 测试页面</h1>
      
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
            borderRadius: '4px',
            color: email ? '#54545C' : '#A7A7A7' // 有输入时使用 #54545C，否则使用 #A7A7A7
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testApiDirect} 
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
          {loading ? '测试中...' : '直接测试API'}
        </button>
        
        <button 
          onClick={testToolFunction} 
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
          {loading ? '测试中...' : '测试工具函数'}
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
      
      <div style={{ marginTop: '30px' }}>
        <h3>说明:</h3>
        <ul>
          <li><strong>直接测试API</strong>: 直接调用 /api/submit-email 端点</li>
          <li><strong>测试工具函数</strong>: 使用 lib/googleSheets.js 中的函数</li>
          <li>打开浏览器开发者工具(F12)查看详细的Console日志</li>
        </ul>
      </div>
    </div>
  );
}