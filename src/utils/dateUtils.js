/**
 * Get the week number for a given date
 * @param {Date} date - The date to get the week number for
 * @returns {number} The week number (1-53)
 */
export function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

/**
 * Get the year number for a given date
 * @param {Date} date - The date to get the year for
 * @returns {number} The year (e.g., 2023)
 */
export function getYearNumber(date) {
  return new Date(date).getFullYear();
}

/**
 * Get the start and end dates for a specific week
 * @param {number} week - The week number
 * @param {number} year - The year
 * @returns {Object} The start and end dates
 */
export function getWeekDates(week, year) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const startDate = new Date(simple);
  if (dow <= 4) {
    startDate.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    startDate.setDate(simple.getDate() + 8 - simple.getDay());
  }
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return {
    startDate,
    endDate,
  };
}

/**
 * Format a date as YYYY-MM-DD for inputs
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
export function formatDateForInput(date) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/**
 * Format a date for display
 * @param {Date} date - The date to format
 * @param {string} format - Format type ('short', 'medium', 'long', 'relative')
 * @returns {string} The formatted date string
 */
export function formatDate(date, format = 'medium') {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString();
  }
  
  if (format === 'medium') {
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  if (format === 'relative') {
    const now = new Date();
    const diffTime = now - d;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return d.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }
  
  return d.toLocaleDateString();
}

/**
 * Get the current week number and year
 * @returns {Object} Object with week and year
 */
export function getCurrentWeekAndYear() {
  const now = new Date();
  return {
    week: getWeekNumber(now),
    year: getYearNumber(now),
  };
}

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export function isToday(date) {
  const today = new Date();
  const d = new Date(date);
  
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export function isPast(date) {
  return new Date(date) < new Date();
}

/**
 * Get the day name for a date
 * @param {Date} date - The date to get the day name for
 * @returns {string} The day name (e.g., "Monday")
 */
export function getDayName(date) {
  return new Date(date).toLocaleDateString(undefined, { weekday: 'long' });
}

/**
 * Get an array of dates for a week
 * @param {number} week - The week number
 * @param {number} year - The year
 * @returns {Array} Array of 7 Date objects
 */
export function getWeekDaysArray(week, year) {
  const { startDate } = getWeekDates(week, year);
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  
  return days;
} 