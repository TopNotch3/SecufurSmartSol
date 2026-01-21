import styles from './loading.module.css';

export default function AccountLoading() {
  return (
    <div className={styles.loading}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.avatarSkeleton}></div>
            <div className={styles.nameSkeleton}></div>
          </div>
          <div className={styles.menuSkeleton}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.menuItem}></div>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.cardSkeleton}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.fieldSkeleton}>
                <div className={styles.labelSkeleton}></div>
                <div className={styles.inputSkeleton}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
