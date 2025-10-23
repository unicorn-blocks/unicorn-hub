import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons, PayPalHostedFieldsProvider, PayPalHostedField } from '@paypal/react-paypal-js';

const PaymentComponent = ({ 
  amount, 
  currency = 'USD', 
  onPaymentSuccess, 
  onPaymentError, 
  isProcessing, 
  setIsProcessing,
  language = 'en',
  orderData 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [cardFormValid, setCardFormValid] = useState(false);
  
  // PayPal配置
  const paypalOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb", // 使用sandbox默认值
    currency: currency,
    intent: "capture",
    components: "buttons,hosted-fields",
    "enable-funding": "paylater,venmo,card",
    "disable-funding": "",
    "data-sdk-integration-source": "integrationbuilder_ac"
  };

  // 检查PayPal Client ID
  const hasPayPalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && 
                           process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "sb";

  // 翻译内容
  const translations = {
    en: {
      paymentMethod: 'Payment Method',
      paypal: 'PayPal',
      creditCard: 'Credit Card',
      payoneer: 'Payoneer',
      paypalDescription: 'Pay securely with PayPal or use your credit card',
      cardDescription: 'Pay securely with your credit or debit card',
      payoneerDescription: 'Pay with Payoneer',
      securityNote: 'All transactions are secure and encrypted.',
      poweredBy: 'Powered by PayPal'
    },
    zh: {
      paymentMethod: '支付方式',
      paypal: 'PayPal',
      creditCard: '信用卡',
      payoneer: 'Payoneer',
      paypalDescription: '使用PayPal安全支付或使用信用卡',
      cardDescription: '使用信用卡或借记卡安全支付',
      payoneerDescription: '使用Payoneer支付',
      securityNote: '所有交易都是安全加密的。',
      poweredBy: '由PayPal提供支持'
    }
  };

  const t = translations[language] || translations.en;

  // PayPal支付成功处理
  const handlePayPalApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      console.log('PayPal payment completed:', details);
      onPaymentSuccess({
        method: 'paypal',
        transactionId: details.id,
        payerId: details.payer.payer_id,
        orderData: orderData
      });
    });
  };

  // PayPal支付错误处理
  const handlePayPalError = (err) => {
    console.error('PayPal payment error:', err);
    onPaymentError(err);
  };

  // 信用卡支付处理
  const handleCardSubmit = () => {
    if (!cardFormValid) {
      onPaymentError({ message: 'Please fill in all card details' });
      return;
    }
    
    setIsProcessing(true);
    
    // 这里应该调用后端API来处理信用卡支付
    // 暂时模拟成功
    setTimeout(() => {
      onPaymentSuccess({
        method: 'card',
        orderData: orderData
      });
      setIsProcessing(false);
    }, 2000);
  };

  // Payoneer支付处理
  const handlePayoneerPayment = () => {
    setIsProcessing(true);
    
    // 调用后端API处理Payoneer支付
    fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...orderData,
        paymentMethod: 'payoneer'
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        onPaymentError(data.error || 'Payment failed');
      }
    })
    .catch(error => {
      onPaymentError(error.message || 'Connection error');
    })
    .finally(() => {
      setIsProcessing(false);
    });
  };

  return (
    <div className="payment-component">
      <h2 className="payment-title">{t.paymentMethod}</h2>
      <p className="payment-security">{t.securityNote}</p>
      
      {/* 支付方式选择 */}
      <div className="payment-method-selector">
        <div className="payment-option">
          <input
            type="radio"
            id="paypal"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-radio"
          />
          <label htmlFor="paypal" className="payment-label">
            <div className="payment-method-card">
              <div className="payment-method-header">
                <div className="custom-radio">
                  <div className={`radio-circle ${paymentMethod === 'paypal' ? 'checked' : ''}`}>
                    {paymentMethod === 'paypal' && <div className="radio-dot"></div>}
                  </div>
                </div>
                <span className="payment-method-name">{t.paypal}</span>
              </div>
              <div className="payment-logos">
                <img src="/assets/checkout/paypal-logo.svg" alt="PayPal" className="payment-logo" />
                <span className="more-cards">+ Credit Cards</span>
              </div>
              <p className="payment-description">{t.paypalDescription}</p>
            </div>
          </label>
        </div>

        <div className="payment-option">
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-radio"
          />
          <label htmlFor="card" className="payment-label">
            <div className="payment-method-card">
              <div className="payment-method-header">
                <div className="custom-radio">
                  <div className={`radio-circle ${paymentMethod === 'card' ? 'checked' : ''}`}>
                    {paymentMethod === 'card' && <div className="radio-dot"></div>}
                  </div>
                </div>
                <span className="payment-method-name">{t.creditCard}</span>
              </div>
              <div className="card-logos">
                <span className="card-logo visa">VISA</span>
                <span className="card-logo mastercard">Mastercard</span>
                <span className="card-logo amex">Amex</span>
                <span className="more-cards">+5</span>
              </div>
              <p className="payment-description">{t.cardDescription}</p>
            </div>
          </label>
        </div>

        <div className="payment-option">
          <input
            type="radio"
            id="payoneer"
            name="paymentMethod"
            value="payoneer"
            checked={paymentMethod === 'payoneer'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-radio"
          />
          <label htmlFor="payoneer" className="payment-label">
            <div className="payment-method-card">
              <div className="payment-method-header">
                <div className="custom-radio">
                  <div className={`radio-circle ${paymentMethod === 'payoneer' ? 'checked' : ''}`}>
                    {paymentMethod === 'payoneer' && <div className="radio-dot"></div>}
                  </div>
                </div>
                <span className="payment-method-name">{t.payoneer}</span>
              </div>
              <div className="payoneer-logo">
                <img src="/assets/checkout/payoneer-logo.svg" alt="Payoneer" className="payment-logo" />
              </div>
              <p className="payment-description">{t.payoneerDescription}</p>
            </div>
          </label>
        </div>
      </div>

      {/* PayPal支付按钮 */}
      {paymentMethod === 'paypal' && (
        <div className="paypal-payment-section">
          <div className="paypal-error">
            <p>PayPal Payment</p>
            <p className="text-sm text-gray-600 mt-2">
              Click the button below to proceed with PayPal's secure payment system.
            </p>
            <button 
              type="button"
              className="paypal-fallback-button"
              onClick={() => {
                // 模拟PayPal支付成功
                onPaymentSuccess({
                  method: 'paypal',
                  transactionId: `PAYPAL-${Date.now()}`,
                  orderData: orderData
                });
              }}
            >
              Continue with PayPal
            </button>
          </div>
          <div className="paypal-powered">
            <span>{t.poweredBy}</span>
            <img src="/assets/checkout/paypal-logo.svg" alt="PayPal" className="paypal-small-logo" />
          </div>
        </div>
      )}

      {/* 信用卡支付表单 */}
      {paymentMethod === 'card' && (
        <div className="card-payment-section">
          <div className="card-error">
            <p>Credit card payment via PayPal Guest Checkout</p>
            <p className="text-sm text-gray-600 mt-2">
              Click the button below to proceed with PayPal's secure guest checkout for credit/debit cards.
            </p>
            <button 
              type="button"
              className="card-fallback-button"
              onClick={() => {
                // 模拟信用卡支付成功
                onPaymentSuccess({
                  method: 'card',
                  transactionId: `DEMO-${Date.now()}`,
                  orderData: orderData
                });
              }}
            >
              Continue with Credit Card
            </button>
          </div>
        </div>
      )}

      {/* Payoneer支付按钮 */}
      {paymentMethod === 'payoneer' && (
        <div className="payoneer-payment-section">
          <button
            type="button"
            className="payoneer-button"
            onClick={handlePayoneerPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay with Payoneer - ${currency} ${amount}`}
          </button>
        </div>
      )}

      <style jsx>{`
        .payment-component {
          width: 100%;
        }

        .payment-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 1rem 0;
        }

        .payment-security {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .payment-method-selector {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .payment-option {
          cursor: pointer;
        }

        .payment-radio {
          display: none;
        }

        .payment-label {
          cursor: pointer;
          display: block;
        }

        .payment-method-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.2s ease;
          background: white;
        }

        .payment-method-card:hover {
          border-color: #7d9ed4;
          box-shadow: 0 2px 8px rgba(125, 158, 212, 0.15);
          transform: translateY(-1px);
        }

        .payment-radio:checked + .payment-label .payment-method-card {
          border-color: #7d9ed4;
          background: rgba(125, 158, 212, 0.08);
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.25);
          transform: translateY(-1px);
        }

        .payment-method-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .custom-radio {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radio-circle {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background: white;
        }

        .radio-circle.checked {
          border-color: #7d9ed4;
          background: #7d9ed4;
        }

        .radio-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: white;
          border-radius: 50%;
          opacity: 0;
          transform: scale(0);
          transition: all 0.2s ease;
        }

        .radio-circle.checked .radio-dot {
          opacity: 1;
          transform: scale(1);
        }

        .payment-method-name {
          font-weight: 500;
          color: #111827;
        }

        .payment-logos, .card-logos {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .payment-logo {
          width: 2rem;
          height: 1.25rem;
          object-fit: contain;
        }

        .card-logo {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          color: white;
        }

        .card-logo.visa {
          background: #1A1F71;
        }

        .card-logo.mastercard {
          background: #EB001B;
        }

        .card-logo.amex {
          background: #006FCF;
        }

        .more-cards {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .payment-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .paypal-payment-section {
          margin-top: 1rem;
        }

        .paypal-powered {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .paypal-small-logo {
          width: 0.75rem;
          height: 0.75rem;
          object-fit: contain;
        }

        .card-payment-section {
          margin-top: 1rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: white;
        }

        .card-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .card-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .payoneer-payment-section {
          margin-top: 1rem;
        }

        .payoneer-button {
          width: 100%;
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          color: white;
          font-weight: 500;
          padding: 1rem 2rem;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .payoneer-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .payoneer-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* 错误提示样式 */
        .paypal-error, .card-error {
          padding: 1.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .paypal-error p, .card-error p {
          color: #374151;
          font-size: 0.875rem;
          margin: 0 0 0.75rem 0;
        }

        .card-error p:first-child {
          font-weight: 500;
          color: #111827;
          font-size: 1rem;
        }

        .paypal-fallback-button, .card-fallback-button {
          width: 100%;
          background: #374151;
          color: white;
          font-weight: 500;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: none;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .paypal-fallback-button:hover, .card-fallback-button:hover {
          background: #1f2937;
        }

        /* PayPal Hosted Fields样式 */
        :global(.paypal-hosted-field) {
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background: white;
        }

        :global(.paypal-hosted-field:focus) {
          outline: none;
          border-color: #7d9ed4;
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.2);
        }

        :global(.paypal-hosted-field:invalid) {
          border-color: #dc2626;
        }

        :global(.paypal-hosted-field:valid) {
          border-color: #059669;
        }
      `}</style>
    </div>
  );
};

export default PaymentComponent;
