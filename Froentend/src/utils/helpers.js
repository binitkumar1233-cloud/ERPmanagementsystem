import { AVATAR_COLORS, GRADE_MAP } from './constants.js';

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str = '', n = 40) => {
  return str.length > n ? str.slice(0, n) + '…' : str;
};

export const getAvatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const getGrade = (percentage) => {
  const thresholds = Object.keys(GRADE_MAP)
    .map(Number)
    .sort((a, b) => b - a);
  for (const t of thresholds) {
    if (percentage >= t) return GRADE_MAP[t];
  }
  return 'F';
};

export const getBarColor = (value, max = 100) => {
  const pct = (value / max) * 100;
  if (pct >= 80) return '#059669';
  if (pct >= 60) return '#d97706';
  return '#dc2626';
};

export const classNames = (...args) =>
  args.filter(Boolean).join(' ');