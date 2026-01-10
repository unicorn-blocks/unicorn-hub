import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { safeApiCall } from '../lib/api';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import BlueTopBar from '../components/BlueTopBar';
import { useLanguage } from '../context/LanguageContext';
import { getSavedEmail } from '../lib/emailStorage';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
function CheckoutForm() {
  const { language } = useLanguage();

  // 表单状态 - 只保留必需字段
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [quantity, setQuantity] = useState(1);
  const [leadId, setLeadId] = useState('');

  // UI状态
  const [isProcessing, setIsProcessing] = useState(false);
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});

  // 在组件挂载时从localStorage读取邮箱
  useEffect(() => {
    console.log('=== Checkout页面 useEffect 开始 ===');

    // 检查localStorage中的所有相关key
    if (typeof window !== 'undefined') {
      console.log('所有localStorage keys:', Object.keys(localStorage));
      console.log('unicorn_blocks_user_email:', localStorage.getItem('unicorn_blocks_user_email'));
      console.log('lead_email:', localStorage.getItem('lead_email')); // 检查是否有其他key
    }

    const savedEmail = getSavedEmail();
    console.log('getSavedEmail() 返回:', savedEmail);

    if (savedEmail) {
      setEmail(savedEmail);
      console.log('设置email状态为:', savedEmail);
    } else {
      console.log('没有找到保存的邮箱');
    }

    // 生成或获取 leadId
    if (typeof window !== 'undefined') {
      let storedLeadId = localStorage.getItem('leadId');
      if (!storedLeadId) {
        storedLeadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('leadId', storedLeadId);
        console.log('生成新的leadId:', storedLeadId);
      } else {
        console.log('使用现有leadId:', storedLeadId);
      }
      setLeadId(storedLeadId);
    }

    console.log('=== Checkout页面 useEffect 结束 ===');
  }, []);

  // 验证函数 - 简化版本，只验证4个字段
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = language === 'en' ? 'Email address is required' : '请输入邮箱地址';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = language === 'en' ? 'Please enter a valid email address' : '请输入有效的邮箱地址';
        } else {
          delete newErrors.email;
        }
        break;
      case 'firstName':
        if (!value) {
          newErrors.firstName = language === 'en' ? 'First name is required' : '请输入名字';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (!value) {
          newErrors.lastName = language === 'en' ? 'Last name is required' : '请输入姓氏';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'zipCode':
        // 邮编是可选的，不验证
        delete newErrors.zipCode;
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 验证整个表单 - 简化版本，只验证4个字段
  const validateForm = () => {
    const fieldsToValidate = [
      { name: 'email', value: email },
      { name: 'firstName', value: firstName },
      { name: 'lastName', value: lastName },
      { name: 'zipCode', value: zipCode }
    ];

    const newErrors = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const { name, value } = field;

      switch (name) {
        case 'email':
          if (!value) {
            newErrors.email = language === 'en' ? 'Email address is required' : '请输入邮箱地址';
            isValid = false;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors.email = language === 'en' ? 'Please enter a valid email address' : '请输入有效的邮箱地址';
            isValid = false;
          }
          break;
        case 'firstName':
          if (!value) {
            newErrors.firstName = language === 'en' ? 'First name is required' : '请输入名字';
            isValid = false;
          }
          break;
        case 'lastName':
          if (!value) {
            newErrors.lastName = language === 'en' ? 'Last name is required' : '请输入姓氏';
            isValid = false;
          }
          break;
        case 'zipCode':
          // 邮编是可选的，不验证
          break;
        default:
          break;
      }
    });

    // 更新错误状态
    setErrors(newErrors);
    return isValid;
  };

  // 错误消息组件
  const ErrorMessage = ({ field }) => {
    if (!errors[field]) return null;

    return (
      <div className="error-message">
        <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <span className="error-text">{errors[field]}</span>
      </div>
    );
  };

  const translations = {
    en: {
      title: 'Checkout - Unicorn Blocks',
      pageTitle: 'Complete Your VIP Reservation',
      subtitle: 'Secure your spot with a $0.50 deposit. Pay the remaining $124 before we ship.',

      // Contact section
      contact: 'Contact Information',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Email',
      newsletterLabel: 'Email me with news and offers',

      // Delivery section
      delivery: 'Delivery Information',
      countryLabel: 'Country/Region',
      firstNameLabel: 'First Name',
      firstNamePlaceholder: 'First name',
      lastNameLabel: 'Last Name',
      lastNamePlaceholder: 'Last name',
      addressLabel: 'Address',
      addressPlaceholder: 'Address',
      apartmentLabel: 'Apartment, suite, etc. (optional)',
      apartmentPlaceholder: 'Apartment, suite, etc. (optional)',
      cityLabel: 'City',
      cityPlaceholder: 'City',
      stateLabel: 'State/Province',
      statePlaceholder: 'State/Province',
      zipLabel: 'ZIP/Postal Code',
      zipPlaceholder: 'Postal code (optional)',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Phone (optional)',

      // Payment section
      payment: 'Payment',
      paymentSecurity: 'All transactions are secure and encrypted.',
      creditCard: 'Credit Card',
      paypal: 'PayPal',
      payoneer: 'Payoneer',
      paypalDescription: 'After clicking "Pay with PayPal", you will be redirected to PayPal to complete your purchase securely.',
      creditCardDescription: 'Pay securely with your credit or debit card',
      payoneerDescription: 'Pay with Payoneer',

      // Order summary
      orderSummary: 'Order Summary',
      productName: 'VIP Spot Reservation',
      productDescription: 'Sparky First Adventure',
      quantity: 'Quantity',
      subtotal: 'Subtotal',
      //shipping: 'Shipping',
      //shippingPending: 'Calculated at checkout',
      total: 'Total',
      discountCode: 'Discount code or gift card',
      applyDiscount: 'Apply',

      // Buttons
      completeOrder: 'Complete Order',
      processing: 'Processing...',

      // Validation messages
      emailError: 'Please enter a valid email address',
      firstNameError: 'Please enter your first name',
      lastNameError: 'Please enter your last name',
      addressError: 'Please enter your address',
      cityError: 'Please enter your city',
      zipError: 'Please enter your ZIP code',
      phoneError: 'Please enter your phone number',
      paymentError: 'Please choose a payment method',

      // Success/Error messages
      paymentSuccess: 'Payment successful! Check your email for confirmation.',
      paymentFailed: 'Payment failed. Please try again.',
      connectionError: 'Connection error. Please try again.',

      // Pricing
      price: '$0.50',
      currency: 'USD'
    },
    zh: {
      title: '结账 - 独角兽积木',
      pageTitle: '完成您的VIP预订',
      subtitle: '支付$0.50订金锁定名额。发货前支付剩余$124。',

      // Contact section
      contact: '联系信息',
      emailLabel: '邮箱地址',
      emailPlaceholder: '邮箱',
      newsletterLabel: '通过邮件接收新闻和优惠信息',

      // Delivery section
      delivery: '配送信息',
      countryLabel: '国家/地区',
      firstNameLabel: '名字',
      firstNamePlaceholder: '名字',
      lastNameLabel: '姓氏',
      lastNamePlaceholder: '姓氏',
      addressLabel: '地址',
      addressPlaceholder: '地址',
      apartmentLabel: '公寓、套房等（可选）',
      apartmentPlaceholder: '公寓、套房等（可选）',
      cityLabel: '城市',
      cityPlaceholder: '城市',
      stateLabel: '州/省',
      statePlaceholder: '州/省',
      zipLabel: '邮编',
      zipPlaceholder: '邮编（可选）',
      phoneLabel: '电话号码',
      phonePlaceholder: '电话（可选）',

      // Payment section
      payment: '支付',
      paymentSecurity: '所有交易都是安全加密的。',
      creditCard: '信用卡',
      paypal: 'PayPal',
      payoneer: 'Payoneer',
      paypalDescription: '点击"使用PayPal支付"后，您将被重定向到PayPal安全完成购买。',
      creditCardDescription: '使用信用卡或借记卡安全支付',
      payoneerDescription: '使用Payoneer支付',

      // Order summary
      orderSummary: '订单摘要',
      productName: 'VIP名额预订',
      productDescription: 'Sparky 首次冒险',
      quantity: '数量',
      subtotal: '小计',
      //shipping: '运费',
      //shippingPending: '结账时计算',
      total: '总计',
      discountCode: '折扣码或礼品卡',
      applyDiscount: '应用',

      // Buttons
      completeOrder: '完成订单',
      processing: '处理中...',

      // Validation messages
      emailError: '请输入有效的邮箱地址',
      firstNameError: '请输入您的名字',
      lastNameError: '请输入您的姓氏',
      addressError: '请输入您的地址',
      cityError: '请输入您的城市',
      zipError: '请输入您的邮编',
      phoneError: '请输入您的电话号码',
      paymentError: '请选择支付方式',

      // Success/Error messages
      paymentSuccess: '支付成功！请查看邮箱确认信息。',
      paymentFailed: '支付失败，请重试。',
      connectionError: '连接错误，请重试。',

      // Pricing
      price: '$0.50',
      currency: 'USD'
    }
  };

  // 根据当前语言选择正确的翻译
  const t = translations[language] || translations.en;


  // 处理支付成功（PayPal返回后）
  const handlePaymentSuccess = (paymentData) => {
    setFormStatus({
      message: t.paymentSuccess,
      type: 'success'
    });

    // 重定向到成功页面（带上订单ID）
    setTimeout(() => {
      const orderId = paymentData.internal_order_id || paymentData.order_id;
      window.location.href = `/payment/success?order_id=${orderId}`;
    }, 2000);
  };

  // 处理支付错误
  const handlePaymentError = (error) => {
    setFormStatus({
      message: error.message || t.paymentFailed,
      type: 'error'
    });
    setIsProcessing(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 重置状态
    setFormStatus({ message: '', type: '' });

    // 表单验证
    if (!validateForm()) {
      return;
    }

    // 检查是否选择了支付方式
    if (!paymentMethod) {
      setFormStatus({
        message: language === 'en' ? 'Please select a payment method' : '请选择支付方式',
        type: 'error'
      });
      return;
    }

    // 表单验证通过，调用支付API
    setIsProcessing(true);

    try {
      // 准备支付数据 - 简化版本，只发送必需字段
      const paymentData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        zip: zipCode,
        leadId: leadId,
        amount: 0.5,
        currency: 'usd'
      };

      // 调用 Stripe Checkout Session API
      const response = await fetch('/api/payment/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (data.success && data.url) {
        // 重定向到 Stripe Checkout 页面
        window.location.href = data.url;
      } else {
        setFormStatus({
          message: data.error || t.paymentFailed,
          type: 'error'
        });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('支付错误:', error);
      setFormStatus({
        message: t.connectionError,
        type: 'error'
      });
      setIsProcessing(false);
    }
  };

  // 处理支付方式选择
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    // 清除任何错误状态
    setFormStatus({ message: '', type: '' });
  };

  // 从页脚提交的处理函数 - 使用统一的Google Sheets工具函数
  const handleFooterSubmit = async (footerEmail, setFooterStatus) => {
    // 设置 email 状态并触发表单提交
    setEmail(footerEmail);

    // Show loading state
    setIsProcessing(true);

    try {
      const { submitEmailToGoogleSheets } = await import('../lib/googleSheets');
      const result = await submitEmailToGoogleSheets(footerEmail, "checkout-footer", "");

      if (result.success) {
        // 不仅更新主表单状态，也更新页脚状态
        setFormStatus({
          message: translations[language].subscribeSuccess,
          type: 'success'
        });
        if (setFooterStatus) {
          setFooterStatus({
            message: translations[language].subscribeSuccess,
            type: 'success'
          });
        }
      } else {
        setFormStatus({
          message: result.message,
          type: 'error'
        });
        if (setFooterStatus) {
          setFooterStatus({
            message: result.message,
            type: 'error'
          });
        }
      }
    } catch (err) {
      console.error('提交错误:', err);
      const errorMessage = translations[language].connectionError;
      setFormStatus({
        message: errorMessage,
        type: 'error'
      });
      if (setFooterStatus) {
        setFooterStatus({
          message: errorMessage,
          type: 'error'
        });
      }
    }

    setIsProcessing(false);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t.title}</title>
      </Head>

      <div className="background-gradient"></div>

      {/* 蓝色顶部条 */}
      <BlueTopBar />

      {/* 使用导航组件 */}
      {/*<Navigation />*/}

      {/* Main Content */}
      <main className="min-h-screen pt-24 px-4 pb-24">
        <div className="buy-container">
          {/* 页面标题 */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight">{t.pageTitle}</h1>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
          </div>

          {/* 两列布局：左侧表单，右侧订单摘要 */}
          <div className="grid grid-cols-1 lg:grid-cols-[4fr_3fr] gap-8 max-w-6xl mx-auto pt-3">

            {/* 左侧：结账表单 */}
            <div className="checkout-form-container surface-card">
              <form onSubmit={handleSubmit} className="checkout-form" noValidate>

                {/* Contact 部分 */}
                <div className="form-section">
                  <h2 className="section-title">{t.contact}</h2>

                  <div className="form-field">
                    <input
                      type="email"
                      id="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateField('email', e.target.value);
                      }}
                      onBlur={(e) => validateField('email', e.target.value)}
                      placeholder={t.emailPlaceholder}
                      disabled={isProcessing}
                      noValidate
                    />
                    <ErrorMessage field="email" />
                  </div>

                  <div className="checkbox-field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newsletter}
                        onChange={(e) => setNewsletter(e.target.checked)}
                        disabled={isProcessing}
                      />
                      <span className="checkbox-text">{t.newsletterLabel}</span>
                    </label>
                  </div>
                </div>

                {/* Delivery 部分 */}
                <div className="form-section">
                  <h2 className="section-title">{t.delivery}</h2>

                  {/* 暂时注释 - Country/Region 字段不需要 */}
                  {/*
                  <div className="form-field">
                    <select 
                      id="country" 
                      className={`form-select ${errors.country ? 'error' : ''}`}
                      value={country}
                      onChange={(e) => {
                        handleCountryChange(e.target.value);
                        validateField('country', e.target.value);
                      }}
                      onBlur={(e) => validateField('country', e.target.value)}
                      disabled={isProcessing}
                    >
                      <option value="">{language === 'en' ? 'Country/Region' : '国家/地区'}</option>
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.name}>
                          {language === 'zh' ? country.nameZh : country.name}
                        </option>
                      ))}
                      <option value="Other">{language === 'zh' ? '其他' : 'Other'}</option>
                    </select>
                    <ErrorMessage field="country" />
                  </div>
                  */}

                  <div className="form-row">
                    <div className="form-field">
                      <input
                        type="text"
                        id="firstName"
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          validateField('firstName', e.target.value);
                        }}
                        onBlur={(e) => validateField('firstName', e.target.value)}
                        placeholder={t.firstNamePlaceholder}
                        disabled={isProcessing}
                      />
                      <ErrorMessage field="firstName" />
                    </div>
                    <div className="form-field">
                      <input
                        type="text"
                        id="lastName"
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          validateField('lastName', e.target.value);
                        }}
                        onBlur={(e) => validateField('lastName', e.target.value)}
                        placeholder={t.lastNamePlaceholder}
                        disabled={isProcessing}
                      />
                      <ErrorMessage field="lastName" />
                    </div>
                  </div>

                  {/* 暂时注释 - Address 字段不需要 */}
                  {/*
                  <div className="form-field">
                    <input 
                      type="text" 
                      id="address" 
                      className={`form-input ${errors.address ? 'error' : ''}`}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        validateField('address', e.target.value);
                      }}
                      onBlur={(e) => validateField('address', e.target.value)}
                      placeholder={t.addressPlaceholder}
                      disabled={isProcessing}
                    />
                    <ErrorMessage field="address" />
                  </div>
                  */}

                  {/* 暂时注释 - Apartment 字段不需要 */}
                  {/*
                  <div className="form-field">
                    <input 
                      type="text" 
                      id="apartment" 
                      className="form-input"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder={t.apartmentPlaceholder}
                      disabled={isProcessing}
                    />
                  </div>
                  */}

                  {/* 暂时注释 - City 和 State 字段不需要 */}
                  {/*
                  <div className="form-row">
                    <div className="form-field">
                      <input 
                        type="text" 
                        id="city" 
                        className={`form-input ${errors.city ? 'error' : ''}`}
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          validateField('city', e.target.value);
                        }}
                        onBlur={(e) => validateField('city', e.target.value)}
                        placeholder={t.cityPlaceholder}
                        disabled={isProcessing}
                      />
                      <ErrorMessage field="city" />
                    </div>
                    {getStatesForCountry(country).length > 0 && (
                      <div className="form-field">
                        <select 
                          id="state" 
                          className={`form-select ${errors.state ? 'error' : ''}`}
                          value={state}
                          onChange={(e) => {
                            setState(e.target.value);
                            validateField('state', e.target.value);
                          }}
                          onBlur={(e) => validateField('state', e.target.value)}
                          disabled={isProcessing}
                        >
                          <option value="">{t.statePlaceholder}</option>
                          {getStatesForCountry(country).map((stateName) => (
                            <option key={stateName} value={stateName}>{stateName}</option>
                          ))}
                        </select>
                        <ErrorMessage field="state" />
                      </div>
                    )}
                  </div>
                  */}

                  {/* ZIP Code - 保留这个字段 */}
                  <div className="form-field">
                    <input
                      type="text"
                      id="zipCode"
                      className={`form-input ${errors.zipCode ? 'error' : ''}`}
                      value={zipCode}
                      onChange={(e) => {
                        setZipCode(e.target.value);
                        validateField('zipCode', e.target.value);
                      }}
                      onBlur={(e) => validateField('zipCode', e.target.value)}
                      placeholder="ZIP Code (helps us plan shipping & availability)"
                      disabled={isProcessing}
                    />
                    <ErrorMessage field="zipCode" />
                  </div>

                  {/* 暂时注释 - Phone 字段不需要 */}
                  {/*
                  <div className="form-field">
                    <input 
                      type="tel" 
                      id="phone" 
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      disabled={isProcessing}
                    />
                  </div>
                  */}
                </div>

                {/* 支付方式选择 - Plaud抽屉风格 */}
                <div className="form-section">
                  <h2 className="section-title">{language === 'en' ? 'Payment Method' : '支付方式'}</h2>
                  <div className="payment-method-selector-plaud">
                    {/* Stripe 支付方式 */}
                    <div className="payment-option-plaud">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="payment-radio-plaud"
                      />
                      <label htmlFor="card" className="payment-label-plaud">
                        <div className="payment-method-content">
                          <div className="payment-method-info">
                            <span className="payment-method-name-plaud">{language === 'en' ? 'Credit card' : '信用卡'}</span>
                          </div>
                          <div className="payment-method-logo">
                            <div className="card-logos-mini">
                              <img src="/assets/checkout/visa.svg" alt="Visa" className="card-icon-main" decoding="async" />
                              <img src="/assets/checkout/mastercard.svg" alt="Mastercard" className="card-icon-main" decoding="async" />
                              <img src="/assets/checkout/amex.svg" alt="American Express" className="card-icon-main" decoding="async" />
                            </div>
                          </div>
                        </div>
                      </label>
                      {/* Stripe 支付信息 */}
                      {paymentMethod === 'card' && (
                        <div className="payment-drawer">
                          <div className="drawer-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                              <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                          </div>
                          <div className="drawer-text">
                            {language === 'en'
                              ? 'Your payment is processed securely by Stripe. You will be redirected to Stripe Checkout to complete your purchase.'
                              : '您的支付由 Stripe 安全处理。您将被重定向到 Stripe Checkout 完成购买。'
                            }
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PayPal 支付方式 */}
                    <div className="payment-option-plaud">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="payment-radio-plaud"
                      />
                      <label htmlFor="paypal" className="payment-label-plaud">
                        <div className="payment-method-content">
                          <div className="payment-method-info">
                            <span className="payment-method-name-plaud">PayPal</span>
                          </div>
                          <div className="payment-method-logo">
                            <img src="/assets/checkout/paypal-logo.svg" alt="PayPal" decoding="async" />
                          </div>
                        </div>
                      </label>
                      {/* PayPal 抽屉内容 */}
                      {paymentMethod === 'paypal' && (
                        <div className="payment-drawer">
                          <div className="drawer-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                              <line x1="8" y1="21" x2="16" y2="21" />
                              <line x1="12" y1="17" x2="12" y2="21" />
                              <path d="M16 8l4 4-4 4" />
                            </svg>
                          </div>
                          <div className="drawer-text">
                            {language === 'en'
                              ? 'After clicking "Complete Order", you will be redirected to PayPal to complete your purchase securely.'
                              : '点击"完成订单"后，您将被重定向到 PayPal 安全完成购买。'
                            }
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payoneer 支付方式 */}
                    <div className="payment-option-plaud">
                      <input
                        type="radio"
                        id="payoneer"
                        name="paymentMethod"
                        value="payoneer"
                        checked={paymentMethod === 'payoneer'}
                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        className="payment-radio-plaud"
                      />
                      <label htmlFor="payoneer" className="payment-label-plaud">
                        <div className="payment-method-content">
                          <div className="payment-method-info">
                            <span className="payment-method-name-plaud">Payoneer</span>
                          </div>
                          <div className="payment-method-logo">
                            <img src="/assets/checkout/payoneer-logo.svg" alt="Payoneer" decoding="async" />
                          </div>
                        </div>
                      </label>
                      {/* Payoneer 抽屉内容 */}
                      {paymentMethod === 'payoneer' && (
                        <div className="payment-drawer">
                          <div className="drawer-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                              <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                          </div>
                          <div className="drawer-text">
                            {language === 'en'
                              ? 'After clicking "Complete Order", you will be redirected to Payoneer to complete your purchase securely.'
                              : '点击"完成订单"后，您将被重定向到 Payoneer 安全完成购买。'
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 错误消息 */}
                {formStatus.type === 'error' && formStatus.message && (
                  <div className="error-message">
                    {formStatus.message}
                  </div>
                )}

                {/* 提交按钮 */}
                <button
                  type="submit"
                  className="primary-button button-shine checkout-button"
                  disabled={isProcessing}
                >
                  {isProcessing ? t.processing : t.completeOrder}
                </button>
              </form>
            </div>

            {/* 右侧：订单摘要 */}
            <div className="order-summary-container surface-card">
              <div className="order-summary">
                <h2 className="summary-title">{t.orderSummary}</h2>

                {/* 产品信息 */}
                <div className="product-item-clean">
                  <div className="product-image-clean">
                    <img
                      src="/assets/checkout/sparky.jpg"
                      alt="Sparky First Adventure"
                      className="product-image"
                      decoding="async"
                    />
                  </div>
                  <div className="product-info-clean">
                    <div className="product-details-clean">
                      <h3 className="product-name-clean">{t.productName}</h3>
                      <p className="product-variant-clean">{t.productDescription}</p>
                      {/* 数量选择器 - 简洁版本 */}
                      <div className="quantity-selector-clean">
                        <button
                          type="button"
                          className="quantity-btn-clean"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          readOnly
                          className="quantity-input-clean"
                        />
                        <button
                          type="button"
                          className="quantity-btn-clean"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="product-price-clean">${(5 * quantity).toFixed(2)}</div>
                  </div>
                </div>

                {/* 折扣码输入 - 简洁版本 - 预订阶段不显示，正式付款时才显示 */}
                {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('type') === 'full' && (
                  <div className="discount-section-clean">
                    <div className="discount-input-group-clean">
                      <input
                        type="text"
                        placeholder={t.discountCode}
                        className="discount-input-clean"
                        disabled={isProcessing}
                      />
                      <button
                        type="button"
                        className="discount-apply-btn-clean"
                        disabled={isProcessing}
                      >
                        {t.applyDiscount}
                      </button>
                    </div>
                  </div>
                )}

                {/* 价格明细 - 简洁版本 */}
                <div className="price-breakdown-clean">
                  <div className="price-row-clean">
                    <span className="price-label-clean">{t.subtotal}</span>
                    <span className="price-value-clean">${(5 * quantity).toFixed(2)}</span>
                  </div>
                  <div className="price-row-clean">
                    <span className="price-label-clean">
                      {t.shipping}
                      {/*<span className="help-icon-small">?</span>*/}
                    </span>
                    <span className="price-value-clean shipping-pending-clean">{t.shippingPending}</span>
                  </div>
                  <div className="price-row-clean total-row-clean">
                    <span className="price-label-clean">{t.total}</span>
                    <span className="price-value-clean total-price-clean">
                      {t.currency} ${(5 * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 浮动通知 */}
      {formStatus.type === 'success' && formStatus.message && (
        <div className="floating-notification">
          <div className="notification-content">
            <div className="notification-header">
              <div className="notification-icon">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <button
                className="notification-close"
                onClick={() => setFormStatus({ message: '', type: '' })}
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="notification-text">
              <div className="notification-title">Processing...</div>
              <div className="notification-message">{formStatus.message}</div>
            </div>
            <div className="notification-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* 传递订阅回调函数给 Footer */}
      {/* <Footer 
        showEmailInput={false} 
        onSubscribe={handleFooterSubmit} 
        /> */}
      <Footer showEmailInput={false} />


      <style jsx global>{`
        /* Basic styles - 保持与reserve-vip-spot页面相同的风格 */
        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          position: relative;
        }

        /* 统一的字体层级系统 */
        :root {
          /* 字体大小层级 */
          --font-size-h1: 2rem;        /* 主标题 */
          --font-size-h2: 1.5rem;      /* 区块标题 */
          --font-size-h3: 1.25rem;     /* 小标题 */
          --font-size-body-lg: 1rem;   /* 大正文 */
          --font-size-body: 0.875rem;  /* 标准正文 */
          --font-size-body-sm: 0.75rem; /* 小正文 */
          --font-size-caption: 0.625rem; /* 说明文字 */
          
          /* 字体字重 */
          --font-weight-light: 300;
          --font-weight-normal: 400;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
          --font-weight-bold: 700;
          --font-weight-extrabold: 800;
          
          /* 行高 */
          --line-height-tight: 1.2;
          --line-height-normal: 1.4;
          --line-height-relaxed: 1.6;
          
          /* 统一的颜色系统 */
          --color-primary: #111827;      /* 主文本色 - 深灰黑 */
          --color-secondary: #374151;    /* 次要文本色 - 中灰 */
          --color-tertiary: #6b7280;     /* 三级文本色 - 浅灰 */
          --color-muted: #9ca3af;        /* 静音文本色 - 更浅灰 */
          --color-brand: #7d9ed4;        /* 品牌色 - 浅蓝 */
          --color-brand-hover: #6b8bc4;  /* 品牌色hover - 深一点的蓝 */
          --color-accent: #f7aebf;       /* 强调色 - 粉色 */
          --color-error: #dc2626;        /* 错误色 - 红色 */
          --color-success: #16a34a;      /* 成功色 - 绿色 */
          --color-warning: #fbbf24;     /* 警告色 - 黄色 */
          --color-border: #e5e7eb;       /* 边框色 - 浅灰 */
          --color-border-focus: #7d9ed4; /* 聚焦边框色 - 品牌色 */
          
          /* 错误提示样式 */
          --error-bg: #fef2f2;           /* 错误背景色 - 浅红 */
          --error-border: #fecaca;      /* 错误边框色 - 中红 */
          --error-text: #dc2626;        /* 错误文字色 - 深红 */
          --error-icon: #ef4444;        /* 错误图标色 - 红 */
        }
        
        .background-gradient {
          position: fixed;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: linear-gradient(180deg, #EBF1FF 0%, #FFEDE4 100%);
          z-index: -1;
        }

        .buy-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* 左侧表单样式 - 与reserve-vip-spot页面保持一致的卡片风格 */
        .checkout-form-container {
          background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          height: fit-content;
        }


        .checkout-form {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-title {
          font-size: var(--font-size-h2);
          font-weight: var(--font-weight-semibold);
          color: var(--color-primary);
          margin: 1rem 0 1.2rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
          position: relative;
          line-height: var(--line-height-tight);
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #7D9ED4, #F7AEBF);
        }

        .form-field {
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-row .form-field {
          margin-bottom: 0;
        }

        .form-row .form-field:nth-child(3) {
          grid-column: span 2;
        }

        .field-label {
          display: block;
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
          color: var(--color-secondary);
          margin-bottom: 0.5rem;
          line-height: var(--line-height-normal);
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1.5px solid var(--color-border);
          border-radius: 12px;
          font-size: 0.875rem;
          color: #A7A7A7; /* 默认颜色 */
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .form-input:not(:placeholder-shown) {
          color: #54545C; /* 有输入时的颜色 */
        }

        .form-input.error {
          border-color: var(--error-border);
          background-color: var(--error-bg);
        }

        .form-input.error:focus {
          border-color: var(--error-border);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-select.error {
          border-color: var(--error-border);
          background-color: var(--error-bg);
        }
        .form-select.error:focus {
          border-color: var(--error-border);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: 8px;
          font-size: var(--font-size-body-sm);
          color: var(--error-text);
          animation: slideDown 0.2s ease-out;
        }

        .error-icon {
          width: 16px;
          height: 16px;
          color: var(--error-icon);
          flex-shrink: 0;
        }

        .error-text {
          flex: 1;
          font-weight: var(--font-weight-medium);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-input:hover {
          border-color: #d1d5db;
        }

        .form-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-select {
          width: 100%;
          padding: 0.875rem 1rem;
          padding-right: 2.5rem;
          border: 1.5px solid var(--color-border);
          border-radius: 12px;
          font-size: 0.875rem;
          color: var(--color-primary);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1rem;
          cursor: pointer;
        }
        
        .form-select option {
          padding: 0.5rem;
          color: var(--color-primary);
          background: #ffffff;
        }
        
        .form-select option:hover {
          background: var(--color-brand);
          color: #ffffff;
        }

        .form-select:focus {
          outline: none;
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.2);
        }

        .form-select:hover {
          border-color: #d1d5db;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.2);
        }

        .form-input.error, .form-select.error {
          border-color: #dc2626;
        }

        .checkbox-field {
          margin-top: 1rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--color-secondary);
        }

        .checkbox-label input[type="checkbox"] {
          margin-right: 0.5rem;
          width: 1rem;
          height: 1rem;
          accent-color: var(--color-brand);
        }

        .checkbox-text {
          font-weight: 400;
        }

        /* 自定义单选按钮样式 */
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
          border-color: var(--color-border-focus);
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


        /* 错误消息 */
        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: var(--color-error);
          padding: 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        /* 提交按钮 */
        .primary-button {
          width: 100%;
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          color: white;
          font-weight: var(--font-weight-semibold);
          padding: 1rem 2rem;
          border-radius: 12px;
          border: none;
          font-size: var(--font-size-body-lg);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          line-height: var(--line-height-normal);
        }

        .button-shine {
          position: relative;
          overflow: hidden;
        }

        .button-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -30%;
          width: 50%;
          height: 200%;
          transform: rotate(25deg);
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 50%, rgba(255,255,255,0) 100%);
          transition: all .5s ease;
        }

        .button-shine:hover::after {
          left: 120%;
        }

        .primary-button:hover:not(:disabled) {
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          transform: none;
          filter: none;
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .checkout-button {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        /* 支付方式选择样式 - 参考Plaud设计 */
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
          border: 2px solid var(--color-border);
          border-radius: 16px;
          padding: 1.25rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .payment-method-card:hover {
          border-color: var(--color-border-focus);
          box-shadow: 0 8px 24px rgba(125, 158, 212, 0.2);
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.95);
        }

        .payment-radio:checked + .payment-label .payment-method-card {
          border-color: var(--color-border-focus);
          background: rgba(125, 158, 212, 0.1);
          box-shadow: 0 8px 24px rgba(125, 158, 212, 0.25);
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
          border-color: var(--color-border-focus);
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
          color: var(--color-primary);
        }

        /* 支付信息框样式 */
        .payment-info-box {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .payment-info-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .payment-info-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #F7AEBF 0%, #9b90da 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .payment-info-icon svg {
          width: 24px;
          height: 24px;
        }

        .payment-info-text {
          flex: 1;
        }

        .payment-info-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0 0 0.25rem 0;
        }

        .payment-info-desc {
          font-size: 0.75rem;
          color: var(--color-tertiary);
          margin: 0;
          line-height: 1.4;
        }

        .payment-card-logos {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .card-logo-small {
          height: 24px;
          width: auto;
          object-fit: contain;
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
          background: #1a1f71;
        }

        .card-logo.mastercard {
          background: #eb001b;
        }

        .card-logo.amex {
          background: #006fcf;
        }

        .more-cards {
          font-size: 0.75rem;
          color: var(--color-tertiary);
          font-weight: 500;
        }

        .payment-description {
          font-size: 0.875rem;
          color: var(--color-tertiary);
          margin: 0;
        }

        /* 支付选择页面样式 */
        .payment-selection {
          padding: 2rem;
        }

        .payment-subtitle {
          color: var(--color-tertiary);
          font-size: 1rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        /* 返回按钮样式 */
        .back-button {
          width: 100%;
          background: #f3f4f6;
          color: var(--color-secondary);
          font-weight: 500;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }

        .back-button:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #9ca3af;
        }

        .back-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* 信用卡安全提示样式 */
        .card-security-notice {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .security-icon {
          font-size: 1.25rem;
          color: #0369a1;
        }

        .security-text {
          flex: 1;
        }

        .security-text strong {
          color: #0369a1;
          font-size: 0.875rem;
          display: block;
          margin-bottom: 0.25rem;
        }

        .security-text p {
          color: #0c4a6e;
          font-size: 0.75rem;
          margin: 0;
        }

        /* 数量选择器样式 */
        .quantity-selector {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .quantity-label {
          font-size: 0.875rem;
          color: var(--color-secondary);
          font-weight: 500;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
        }

        .quantity-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f9fafb;
          color: var(--color-secondary);
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #e5e7eb;
          color: var(--color-primary);
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          color: var(--color-primary);
          padding: 0 0.5rem;
          background: white;
        }

        /* Plaud风格支付方式样式 */
        .payment-method-selector-plaud {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .payment-option-plaud {
          position: relative;
        }

        .payment-radio-plaud {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .payment-label-plaud {
          display: block;
          cursor: pointer;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.2s ease;
          background: #ffffff;
        }

        .payment-label-plaud:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .payment-radio-plaud:checked + .payment-label-plaud {
          border-color: var(--color-border-focus);
          background: #f0f9ff;
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
        }

        .payment-method-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .payment-method-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .payment-method-name-plaud {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .payment-method-desc {
          font-size: 0.75rem;
          color: var(--color-tertiary);
        }

        .payment-method-logo {
          display: flex;
          align-items: center;
        }

        .payment-method-logo img {
          height: 24px;
          width: auto;
        }

        .card-logos-mini {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .card-icon-main {
          width: 28px;
          height: 18px;
          object-fit: contain;
        }

        /* 抽屉样式 */
        .payment-drawer {
          margin-top: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .drawer-icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          color: #64748b;
          margin-top: 0.125rem;
        }

        .drawer-icon svg {
          width: 100%;
          height: 100%;
        }

        .drawer-text {
          flex: 1;
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.5;
        }

        .more-cards-container {
          position: relative;
          margin-left: 0.25rem;
          z-index: 1001;
          overflow: visible;
        }

        .more-cards-btn {
          font-size: 0.625rem;
          font-weight: 500;
          color: var(--color-tertiary);
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .more-cards-btn:hover {
          background: #e5e7eb;
          color: var(--color-secondary);
        }

        .more-cards-popup {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 0.5rem;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-radius: 12px;
          padding: 0.75rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          animation: fadeInUp 0.2s ease-out;
          pointer-events: auto;
          width: auto;
          min-width: 120px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .more-cards-popup::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.7);
        }

        /* Security code tooltip样式 */
        .security-code-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          right: -20px;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-radius: 12px;
          padding: 0.75rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          animation: fadeInUp 0.2s ease-out;
          pointer-events: auto;
          width: 280px;
          font-size: 0.75rem;
          line-height: 1.4;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .security-code-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          right: 24px;
          border: 6px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.9);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .more-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.25rem;
          width: 100%;
        }

        .card-icon-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.125rem;
        }

        .card-icon-svg {
          width: 20px;
          height: 14px;
          object-fit: contain;
        }

        /* 信用卡输入字段样式 */
        .card-input-fields {
          margin-top: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          animation: slideDown 0.2s ease-out;
        }

        .security-icon, .help-icon {
          margin-left: 0.5rem;
          font-size: 0.75rem;
          color: var(--color-tertiary);
        }

        .help-icon-container {
          position: relative;
          display: inline-block;
        }

        .cvv-field-wrapper {
          position: relative;
        }

        .cvv-field-wrapper .form-input {
          padding-right: 2.5rem;
        }

        .cvv-help-icon-container {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-block;
          z-index: 10;
        }

        .cvv-help-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #e5e7eb;
          color: var(--color-tertiary);
          font-size: 11px;
          font-weight: 600;
          cursor: help;
          transition: all 0.2s ease;
        }

        .cvv-help-icon:hover {
          background: var(--color-brand);
          color: white;
        }

        .billing-address-section {
          margin-top: 1rem;
        }

        .billing-address-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 0;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          accent-color: var(--color-brand);
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 0.875rem;
          color: var(--color-secondary);
          cursor: pointer;
          user-select: none;
        }

        .billing-address-fields {
          margin-top: 0.75rem;
          animation: slideDown 0.2s ease-out;
        }

        .billing-section-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0 0 1rem 0;
        }

        .billing-address-fields .form-field {
          margin-bottom: 1rem;
        }

        .billing-address-fields .form-field:last-child {
          margin-bottom: 0;
        }

        .billing-address-fields .form-row {
          margin-bottom: 0;
        }

        .billing-address-fields .form-row .form-field {
          margin-bottom: 0;
        }

        .billing-address-fields .form-row + .form-field {
          margin-top: 1rem;
        }

        /* 简洁版订单摘要样式 - 参考截图设计 */
        .product-item-clean {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
          margin-bottom: 1.5rem;
        }

        .product-image-clean {
          position: relative;
          flex-shrink: 0;
        }

        .product-image {
          width: 70px;
          height: 70px;
          border-radius: 12px;
          object-fit: cover;
          border: 1px solid rgba(125, 158, 212, 0.2);
        }


        .product-info-clean {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .product-details-clean {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          height: 70px;
        }

        .product-name-clean {
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-semibold);
          color: var(--color-primary);
          margin: 0;
          line-height: var(--line-height-normal);
        }

        .product-variant-clean {
          font-size: 0.75rem;
          color: var(--color-tertiary);
          margin: 0;
          line-height: 1.4;
        }

        .quantity-selector-clean {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
          width: fit-content;
          margin-top: auto;
        }

        .quantity-btn-clean {
          width: 26px;
          height: 26px;
          border: none;
          background: #f9fafb;
          color: var(--color-secondary);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .quantity-btn-clean:hover:not(:disabled) {
          background: #e5e7eb;
          color: var(--color-primary);
        }

        .quantity-btn-clean:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-input-clean {
          width: 40px;
          height: 26px;
          border: none;
          text-align: center;
          font-weight: 600;
          color: var(--color-primary);
          background: white;
          font-size: 0.875rem;
          outline: none;
        }

        .product-price-clean {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          text-align: right;
          flex-shrink: 0;
        }

        .discount-section-clean {
          margin-bottom: 1.5rem;
        }

        .discount-input-group-clean {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          min-width: 0; /* iOS Safari flexbox fix */
        }

        .discount-input-clean {
          flex: 1;
          min-width: 0; /* iOS Safari flexbox fix */
          width: 100%; /* iOS Safari width fix */
          padding: 0.875rem 1rem;
          border: 1.5px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.875rem;
          color: var(--color-primary);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          -webkit-appearance: none; /* iOS Safari input styling fix */
        }

        .discount-input-clean:focus {
          outline: none;
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.2);
        }

        .discount-apply-btn-clean {
          flex-shrink: 0; /* iOS Safari flexbox fix */
          padding: 0.75rem 1.25rem;
          background: linear-gradient(90deg, #F7AEBF 0%, #9b90da 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: var(--font-size-body);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: none;
          line-height: var(--line-height-normal);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          -webkit-appearance: none; /* iOS Safari button styling fix */
        }

        .discount-apply-btn-clean:hover:not(:disabled) {
          /* 无hover效果 */
        }

        .discount-apply-btn-clean:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .price-breakdown-clean {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .price-row-clean {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-label-clean {
          font-size: 0.875rem;
          color: var(--color-secondary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .price-value-clean {
          font-size: 0.875rem;
          color: var(--color-primary);
          font-weight: 500;
        }

        .help-icon-small {
          font-size: 0.75rem;
          color: var(--color-tertiary);
        }

        .shipping-pending-clean {
          font-style: italic;
          color: var(--color-tertiary);
        }

        .total-row-clean {
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border);
        }

        .total-row-clean .price-label-clean {
          font-weight: 600;
          font-size: 1rem;
        }

        .total-price-clean {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.125rem;
        }

        .total-price-clean .currency {
          font-size: 0.75rem;
          color: var(--color-tertiary);
          font-weight: 400;
        }

        .total-price-clean .amount {
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-h3);
          color: var(--color-primary);
        }

        /* 右侧订单摘要样式 - 使用与reserve-vip-spot相同的卡片风格 */
        .order-summary-container {
          background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          height: fit-content;
          position: sticky;
          top: 6rem; /* 增加距离，确保不被导航栏遮盖且有足够间距 */
          max-height: calc(100vh - 8rem); /* 限制最大高度，避免超出视窗 */
          overflow-y: auto; /* 如果内容过多，允许滚动 */
        }

        .summary-title {
          font-size: var(--font-size-h2);
          font-weight: var(--font-weight-semibold);
          color: var(--color-primary);
          margin: 1rem 0 1.2rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f3f4f6;
          position: relative;
          line-height: var(--line-height-tight);
        }

        .summary-title::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #7D9ED4, #F7AEBF);
        }

        .product-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .product-image {
          flex-shrink: 0;
          position: relative;
        }

        .product-placeholder {
          width: 3rem;
          height: 3rem;
          background: #f3f4f6;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-muted);
        }

        .product-placeholder svg {
          width: 1.5rem;
          height: 1.5rem;
        }

        .product-badge {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          background: #111827;
          color: white;
          border-radius: 50%;
          width: 1.25rem;
          height: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .product-details {
          flex: 1;
        }

        .product-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-primary);
          margin: 0 0 0.25rem 0;
        }

        .product-description {
          font-size: 0.75rem;
          color: var(--color-tertiary);
          margin: 0 0 0.5rem 0;
        }

        .product-price {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-primary);
          align-self: flex-start;
        }

        /* 折扣码样式 */
        .discount-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
        }

        .discount-input-group {
          display: flex;
          gap: 0.5rem;
        }

        .discount-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background: white;
        }

        .discount-input:focus {
          outline: none;
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 3px rgba(125, 158, 212, 0.2);
        }

        .discount-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .discount-apply-btn {
          padding: 0.75rem 1rem;
          background: #374151;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .discount-apply-btn:hover:not(:disabled) {
          background: #7d9ed4;
        }

        .discount-apply-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* 价格明细 */
        .price-breakdown {
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .price-row:last-child {
          margin-bottom: 0;
        }

        .price-label {
          font-size: 0.875rem;
          color: var(--color-secondary);
        }

        .price-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-primary);
        }

        .shipping-pending {
          color: var(--color-tertiary);
          font-style: italic;
        }

        .total-row {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }

        .total-row .price-label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .total-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        /* Why Choose 部分样式 */
        .why-choose-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
        }

        .why-choose-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-primary);
          margin: 0 0 1rem 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .feature-icon {
          width: 1rem;
          height: 1rem;
          color: var(--color-brand);
          flex-shrink: 0;
        }

        .feature-text {
          font-size: 0.75rem;
          color: var(--color-secondary);
          font-weight: 500;
        }

        .trust-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .sparkle-icon {
          width: 1rem;
          height: 1rem;
          color: var(--color-warning);
        }

        .trust-text {
          font-size: 0.75rem;
          color: var(--color-tertiary);
          font-weight: 500;
        }


        /* 统一卡片底部样式：背景与边框 - 与reserve-vip-spot页面保持一致 */
        .surface-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(12px);
        }

        /* Footer间距 */
        .section-spacing {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }

        /* 浮动通知样式 */
        .floating-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
        }

        .notification-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 320px;
          max-width: 400px;
        }

        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .notification-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .notification-text {
          margin-bottom: 0.75rem;
        }

        .notification-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .notification-message {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .notification-progress {
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          animation: progressAnimation 3s ease-out forwards;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progressAnimation {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .buy-container {
            padding: 0 1rem;
          }
          
          .checkout-form-container, .order-summary-container {
            padding: 2rem;
          }
          
          /* 平板端调整固定位置 */
          .order-summary-container {
            top: 5.5rem;
            max-height: calc(100vh - 7.5rem);
          }
        }

        @media (max-width: 768px) {
          .buy-container {
            padding: 0 1rem;
          }
          
          .checkout-form-container, .order-summary-container {
            padding: 1.5rem;
          }
          
          /* 移动端取消固定定位，正常显示 */
          .order-summary-container {
            position: static;
            top: auto;
            max-height: none;
            overflow-y: visible;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .form-row .form-field:nth-child(3) {
            grid-column: span 1;
          }

          .product-item {
            flex-direction: column;
            gap: 0.75rem;
          }

          .product-details {
            order: 1;
          }

          .product-price {
            order: 2;
            align-self: flex-start;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .discount-input-group {
            flex-direction: column;
          }

          .floating-notification {
            top: 10px;
            right: 10px;
            left: 10px;
          }
          
          .notification-content {
            min-width: auto;
            max-width: none;
          }
        }
      `}</style>
    </>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}