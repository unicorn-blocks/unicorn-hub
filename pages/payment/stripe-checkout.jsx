import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * 这个页面直接创建 Stripe Checkout Session 并重定向
 * 用于从 reserve-vip-spot 页面直接跳转到 Stripe Checkout
 */
export default function StripeCheckout() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    // 页面加载时立即创建 Stripe Session 并重定向
    const createCheckoutSession = async () => {
      try {
        // 调用 Stripe Checkout Session API，不传递任何用户信息
        // Stripe 会在 Checkout 页面收集用户信息
        const response = await fetch('/api/payment/stripe/checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: 0.5,
            currency: 'usd'
          })
        });

        const data = await response.json();

        if (data.success && data.url) {
          // 重定向到 Stripe Checkout 页面
          window.location.href = data.url;
        } else {
          setError(data.error || '无法创建支付会话，请重试。');
        }
      } catch (err) {
        console.error('创建 Stripe Session 错误:', err);
        setError('连接错误，请重试。');
      }
    };

    createCheckoutSession();
  }, []);

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={() => router.back()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // 加载中
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ color: '#6b7280' }}>Redirecting to checkout...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
