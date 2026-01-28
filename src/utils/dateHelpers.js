// Format date to readable string
export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateStr = date.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (dateStr === todayStr) {
    return 'Today';
  } else if (dateStr === yesterdayStr) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}

// Format time
export function formatTime(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Format date and time together
export function formatDateTime(dateString) {
  if (!dateString) return '';

  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
}

// Get date in YYYY-MM-DD format for input fields
export function getDateInputValue(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Get start of day
export function getStartOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get end of day
export function getEndOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Get date range for last N days
export function getLastNDays(n) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - n);

  return {
    start: getStartOfDay(start),
    end: getEndOfDay(end)
  };
}

// Get week range
export function getWeekRange() {
  return getLastNDays(7);
}

// Get month range
export function getMonthRange() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    start: getStartOfDay(start),
    end: getEndOfDay(end)
  };
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(dateString);
}
