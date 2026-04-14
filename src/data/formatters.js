/** Shared invoice / portal formatters (both Summit and Tesla demos). */

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatDateTime = (isoStr) =>
  new Date(isoStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const getStatusLabel = (status) => {
  switch (status) {
    case 'overdue':
      return 'Overdue';
    case 'due_soon':
      return 'Due Soon';
    case 'current':
      return 'Current';
    default:
      return status;
  }
};

export const getStatusVariant = (status) => {
  switch (status) {
    case 'overdue':
      return 'danger';
    case 'due_soon':
      return 'warning';
    case 'current':
      return 'neutral';
    default:
      return 'neutral';
  }
};
