export const formatPrice = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'shipped':
    case 'out for delivery':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'processing':
    case 'confirmed':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};
