'use client';

import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
  className = '',
}) => {
  const skeletonClasses = [
    styles.skeleton,
    styles[variant],
    animation !== 'none' ? styles[animation] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return <div className={skeletonClasses} style={style} />;
};

// Preset skeleton components
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => {
  return (
    <div className={`${styles.textWrapper} ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 && lines > 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonImage: React.FC<{
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
  className?: string;
}> = ({ width = '100%', height, aspectRatio = '1/1', className = '' }) => {
  return (
    <div
      className={`${styles.imageWrapper} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        aspectRatio: !height ? aspectRatio : undefined,
      }}
    >
      <Skeleton width="100%" height="100%" />
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      <SkeletonImage aspectRatio="1/1" />
      <div className={styles.cardContent}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  );
};

export const SkeletonProductCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`${styles.productCard} ${className}`}>
      <SkeletonImage aspectRatio="1/1" />
      <div className={styles.productContent}>
        <Skeleton variant="text" width="30%" height={12} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="60%" height={14} />
        <Skeleton variant="text" width="40%" height={24} />
      </div>
    </div>
  );
};

export default Skeleton;
