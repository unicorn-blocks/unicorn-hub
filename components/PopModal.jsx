import { useState } from 'react';
import Image from 'next/image';
import styles from './PopModal.module.css';

export default function PopModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Google Sheets 版提交通知
  const handleNotify = async () => {
    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }
    try {
      const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyn8MOU7baUKZ2exFQsLZD6hGs8poE8KpE31vIrpLXgeoLB4EItUzVgn0qTKi9eqmk9/exec";
      const res = await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email,
          source: "pop-modal",
          note: "reserve-pop-modal",
        }),
      });
      const text = await res.text();
      if (!text.includes('OK')) {
        setError('Server error: ' + text);
        return;
      }
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/reserve-vip-spot';
      }, 800);
    } catch (err) {
      setError('Network error');
    }
  };

  // hover时按钮文字切换，点击后submitted就变回Notify at Launch
  let btnText = 'Join Adventure';
  if (isHovered && !submitted) btnText = 'Reserve My Spot';

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
            <input
              type="email"
              placeholder="Enter email address..."
              value={email}
              onChange={e => {
                setEmail(e.target.value); setError(''); setSubmitted(false);}}
              className={styles.inputEmail}
              disabled={submitted}
            />
            {/* 按钮+dudu置于右边，按钮顶对齐 */}
            <div className={styles.btnWithDogWrap}>
              <Image src="/assets/ima/dudu.png" alt="dudu" width={47} height={47} className={styles.duduDog} />
              <button
                className={styles.notifyBtn + (submitted ? ' ' + styles.submitted : '')}
                style={submitted ? { background: '#4E81A8' } : {}}
                onClick={handleNotify}
                disabled={submitted}
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
