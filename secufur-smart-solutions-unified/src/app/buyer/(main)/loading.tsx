import styles from './loading.module.css';

export default function MainLoading() {
  return (
    <div className={styles.loading}>
      <div className={styles.container}>
        {/* Header skeleton */}
        <div className={styles.headerSkeleton}>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.subtitleSkeleton}></div>
        </div>

        {/* Content grid skeleton */}
        <div className={styles.gridSkeleton}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.cardSkeleton}>
              <div className={styles.imageSkeleton}></div>
              <div className={styles.cardContent}>
                <div className={styles.textSkeleton}></div>
                <div className={styles.textSkeletonShort}></div>
                <div className={styles.priceSkeleton}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
