'use client';

import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    dot ? styles.dot : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses}>
      {dot && <span className={styles.dotIndicator}></span>}
      {children}
    </span>
  );
};

export interface CountBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  size?: BadgeSize;
  variant?: BadgeVariant;
  className?: string;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  size = 'sm',
  variant = 'default',
  className = '',
}) => {
  if (count === 0 && !showZero) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge variant={variant} size={size} className={`${styles.countBadge} ${className}`}>
      {displayCount}
    </Badge>
  );
};

export default Badge;
