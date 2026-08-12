import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PAID':
      case 'VERIFIED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SUBMITTED':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
