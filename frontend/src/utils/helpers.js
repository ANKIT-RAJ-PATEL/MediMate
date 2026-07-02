import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function formatDateTime(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function getRiskColor(severity) {
  const colors = {
    low: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    moderate: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    high: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    critical: 'text-red-500 bg-red-50 dark:bg-red-900/20'
  };
  return colors[severity] || colors.low;
}

export function getStatusColor(status) {
  const colors = {
    pending: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    confirmed: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    completed: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    cancelled: 'text-red-500 bg-red-50 dark:bg-red-900/20'
  };
  return colors[status] || colors.pending;
}

export function getReportTypeName(type) {
  const names = {
    blood_test: 'Blood Test', cbc: 'CBC', lipid_profile: 'Lipid Profile',
    thyroid: 'Thyroid', liver_function: 'Liver Function', kidney_function: 'Kidney Function',
    diabetes: 'Diabetes', xray: 'X-Ray', mri: 'MRI', other: 'Other'
  };
  return names[type] || type;
}
