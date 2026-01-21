import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.code}>404</h1>
          <h2 className={styles.title}>Page Not Found</h2>
          <p className={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Don&apos;t worry, let&apos;s get you back on track.
          </p>

          <div className={styles.actions}>
            <Link href="/buyer" className={styles.primaryButton}>
              Back to Home
            </Link>
            <Link href="/buyer/search" className={styles.secondaryButton}>
              Search Products
            </Link>
          </div>
        </div>

        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Popular Categories</h3>
          <div className={styles.categoryGrid}>
            <Link href="/buyer/batteries" className={styles.categoryCard}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Batteries</span>
            </Link>
            <Link href="/buyer/electronics" className={styles.categoryCard}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span>Electronics</span>
            </Link>
            <Link href="/buyer/customized-batteries" className={styles.categoryCard}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Custom Batteries</span>
            </Link>
            <Link href="/buyer/customized-electronics" className={styles.categoryCard}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Custom Electronics</span>
            </Link>
          </div>
        </div>

        <div className={styles.helpSection}>
          <h3 className={styles.helpTitle}>Need Help?</h3>
          <p className={styles.helpText}>
            If you believe this is an error or need assistance, our support team is here to help.
          </p>
          <div className={styles.helpLinks}>
            <Link href="/buyer/help">Help Center</Link>
            <Link href="/buyer/contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
