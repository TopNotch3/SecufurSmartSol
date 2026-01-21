'use client';

import React from 'react';
import styles from './Loader.module.css';

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LoaderProps {
  size?: LoaderSize;
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text,
}) => {
  const loaderClasses = [
    styles.loader,
    styles[size],
    styles[color],
  ].join(' ');

  if (fullScreen) {
    return (
      <div className={styles.fullScreenWrapper}>
        <div className={styles.fullScreenContent}>
          <div className={loaderClasses}>
            <div className={styles.spinner}></div>
          </div>
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={loaderClasses}>
        <div className={styles.spinner}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return <Loader size="lg" fullScreen text={text} />;
};

export const InlineLoader: React.FC<{ size?: LoaderSize }> = ({ size = 'sm' }) => {
  return (
    <span className={styles.inline}>
      <Loader size={size} />
    </span>
  );
};

export default Loader;
