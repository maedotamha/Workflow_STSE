/**
 * Formats a transaction date string.
 * If the date is within the last 7 days, returns the day name (e.g., Monday).
 * Otherwise, returns the formatted date string.
 */
export const formatTransactionDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  
  // Set times to midnight for accurate day comparison
  const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  
  if (diffDays <= 7) {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  }

  return new Intl.DateTimeFormat('en-US', { 
    month: 'numeric', 
    day: 'numeric', 
    year: '2-digit' 
  }).format(date);
};
