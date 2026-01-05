import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './PopModal.module.css';
// 不再持久化邮箱，本地状态即可

export default function PopModal({ onClose, isVip = true }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEmailSaved, setIsEmailSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Google Sheets 版提交通知 - 乐观更新：先跳转，后台异步提交
  const handleNotify = async () => {
    // 防止重复提交
    if (isProcessing) return;

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }

    setIsProcessing(true);
    setIsHovered(false);

    // 显示 700ms "Joining" 状态后执行
    setTimeout(() => {
      if (isVip) {
        // VIP站：跳转到VIP页面
        router.push('/reserve-vip-spot');
      } else {
        // 主站：显示成功视图
        setShowSuccess(true);
        setIsProcessing(false);
      }
    }, 700);

    // 后台异步提交（不阻塞）
    import('../lib/googleSheets').then(({ submitEmailToGoogleSheets }) => {
      submitEmailToGoogleSheets(email, "pop-modal", "reserve-pop-modal")
        .then(result => {
          if (!result.success) {
            console.warn('Email submission failed:', result.message);
          }
        })
        .catch(err => console.error('提交错误:', err));
    });
  };

  // 固定按钮文案
  const btnText = 'Join Adventure';

  // 成功视图（仅主站使用）
  if (showSuccess) {
    return (
      <div className={styles.popModalMask}>
        <div className={styles.popModalMain}>
          <div className={styles.blackShadow}></div>
          <div className={styles.yellowPanel}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="close">×</button>
            <div className={styles.successView}>
              <div className={styles.successEmoji}>🎉</div>
              <h2 className={styles.successTitle}>Thank You for Joining!</h2>
              <p className={styles.successText}>We will notify you when we launch!</p>
              <button className={styles.gotItBtn} onClick={onClose}>Got it!</button>
            </div>
          </div>
        </div>
      </div>
    );
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
          <h2 className={styles.reserveTitle}>
            <span>Exclusive VIP <br className="md:hidden" />Invitation 💌</span>
          </h2>
          {/* 内容区域 - hover时不再隐藏 */}
          <div className={styles.contentMiddle}>
            <div className={styles.txtLine}>
              Get <span>Launch Updates</span>, <span>Early-Bird Perks</span>, and the first access to our <span>Exclusive VIP Price</span>.
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
                  setEmail(e.target.value); setError(''); setSubmitted(false);
                }}
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
                {isProcessing ? 'Joining' : btnText}
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
