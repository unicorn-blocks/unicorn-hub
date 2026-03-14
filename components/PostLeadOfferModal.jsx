import styles from './PostLeadOfferModal.module.css';

export default function PostLeadOfferModal({
  isOpen,
  onReserve,
  onNoThanks,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.mask}>
      <div className={styles.panelWrap}>
        <div className={styles.panelShadow} />
        <div className={styles.panel} role="dialog" aria-modal="true" aria-label="VIP offer">
          <div className={styles.bgGlow} />
          <div className={styles.content}>
            <div className={styles.topLayout}>
              <div className={styles.infoBlock}>
                <h2 className={styles.title}>Want to lock your $149 VIP price?</h2>
                <p className={styles.subtitle}>
                  Pay a fully refundable $2 deposit to reserve your $100 VIP discount.
                </p>

                <div className={styles.priceRow}>
                  <span className={styles.currentPrice}>$149</span>
                  <span className={styles.originalPrice}>$249</span>
                </div>

                <div className={styles.trustRow}>
                  <span className={styles.stripeBadge}>Powered by Stripe</span>
                  <span className={styles.secureText}>Safe and Secure checkout</span>
                </div>
              </div>

              <div className={styles.mediaBlock}>
                <div className={styles.mediaInfoRow}>
                  <div className={styles.previewImageWrap}>
                    <img
                      src="/assets/checkout/sparky.webp"
                      alt="Unicorn Blocks VIP bundle"
                      className={styles.previewImage}
                    />
                  </div>

                  <div className={styles.featureCopy}>
                    <h3 className={styles.featureTitle}>Unicorn Blocks VIP Bundle</h3>
                    <ul className={styles.featureList}>
                      <li>Sparky: Your Block Buddy</li>
                      <li>4 Magical Hats</li>
                      <li>4 Magical Blocks</li>
                      <li>100+ Universal Blocks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <button
              className={styles.primaryBtn}
              onClick={onReserve}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Lock My $149 Price'}
            </button>

            <button
              className={styles.secondaryBtn}
              onClick={onNoThanks}
              disabled={isLoading}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
