import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './PopModal.module.css';
import { saveEmail, getSavedEmail } from '../lib/emailStorage';

export default function PopModal({ onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmailSaved, setIsEmailSaved] = useState(false);

  // 组件加载时检查是否有保存的邮箱
  useEffect(() => {
    const savedEmail = getSavedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setIsEmailSaved(true);
    }
  }, []);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Google Sheets 版提交通知 - 使用统一工具函数
  const handleNotify = async () => {
    // 防止重复提交
    if (isProcessing) return;
    
    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }
    
    setIsProcessing(true);
    setIsHovered(false);  // 立即重置hover状态，让文字变成"Join Adventure"
    
    try {
      // 动态导入工具函数
      const { submitEmailToGoogleSheets } = await import('../lib/googleSheets');
      const result = await submitEmailToGoogleSheets(email, "pop-modal", "reserve-pop-modal");
      
      if (result.success) {
        // 保存邮箱到 localStorage
        console.log('=== PopModal 保存邮箱 ===');
        console.log('要保存的邮箱:', email);
        saveEmail(email);
        
        // 验证保存是否成功
        const savedEmail = getSavedEmail();
        console.log('保存后验证读取:', savedEmail);
        console.log('localStorage直接读取:', localStorage.getItem('unicorn_blocks_user_email'));
        
        setIsEmailSaved(true);
        setSubmitted(true);
        
        // 使用 Next.js Router 进行平滑导航
        setTimeout(() => {
          router.push('/reserve-vip-spot');
        }, 2);  // 延迟300毫秒后跳转
      } else {
        setError(result.message);
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('提交错误:', err);
      setError('Network error');
      setIsProcessing(false);
    }
  };

  // hover时按钮文字切换
  let btnText = 'Join Adventure';
  if (isHovered && !submitted) {
    btnText = 'Reserve My Spot';
  }
 

  return (
    <div className={styles.popModalMask}>
      <div
        className={styles.popModalMain}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 黑色叠底 */}
        <div className={styles.blackShadow}></div>
        {/* 黄色主弹窗 */}
        <div className={styles.yellowPanel}>
          {/* 关闭按钮 */}
          <button className={styles.closeBtn} onClick={onClose} aria-label="close">×</button>
          {/* 顶部飞机 */}
          <Image src="/assets/ima/Image copy 1.png" alt="airplane" width={151} height={161} className={styles.plane} />
          {/* 大标题 */}
          <h2 className={styles.reserveTitle}><span>Reserve VIP spot!</span></h2>
          {/* 内容区域 - hover时不再隐藏 */}
          <div>
            <div className={styles.txtLine}>
              Reserve your VIP spot now for <span>$5</span> and secure <span className={styles.discount}>$49 off</span> the retail price on launch day.
            </div>
            <div className={styles.counterRow}>
              <span>Only</span>
              <Image src="/assets/ima/svg 37.png" alt="calendar num" width={86} height={91} className={styles.calendar} />
              <span className={styles.counterRest}>of 500 left!</span>
            </div>
          </div>
          {/* 底部输入区块 - hover时位置不再改变 */}
          <div className={styles.bottomInputWrapper}>
            {/* 邮箱输入框放左边 */}
            <div style={{ position: 'relative', width: 281, height: 44 }}>
              <input
                type="email"
                placeholder="Enter your email to join"
                value={email}
                onChange={e => {
                  setEmail(e.target.value); setError(''); setSubmitted(false);}}
                className={styles.inputEmail}
                style={{ paddingRight: isEmailSaved ? '40px' : '17px' }}
                disabled={submitted}
              />
              {isEmailSaved && (
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                  color: '#10B981',
                  pointerEvents: 'none'
                }}>
                  ✅
                </span>
              )}
            </div>
            {/* 按钮+dudu置于右边，按钮顶对齐 */}
            <div className={styles.btnWithDogWrap}>
              <Image src="/assets/ima/dudu.png" alt="dudu" width={47} height={47} className={styles.duduDog} />
              <button
                className={styles.notifyBtn + (submitted ? ' ' + styles.submitted : '')}
                style={submitted ? { background: '#4E81A8' } : {}}
                onClick={handleNotify}
                disabled={submitted || isProcessing}
              >
                {btnText}
              </button>
            </div>
            {/* 错误提示 */}
            {error && <div className={styles.errorTip}>{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
