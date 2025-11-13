/**
 * Date utility functions for handling date operations in the Patient Photo Management System
 */

import { format, parse, formatDistanceToNow, isToday, isYesterday, differenceInDays } from 'date-fns';

/**
 * Formats a date using the specified format string
 * @param date - The date to format (Date object or ISO string)
 * @param formatString - The format string (default: 'yyyy-MM-dd')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, formatString: string = 'yyyy-MM-dd'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Gets the current date in YYYY-MM-DD format
 * @returns Current date string in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Parses a date string into a Date object
 * @param dateString - The date string to parse (supports various formats)
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  try {
    // Try parsing as ISO date first
    let date = new Date(dateString);

    if (!isNaN(date.getTime())) {
      return date;
    }

    // Try common formats
    const formats = [
      'yyyy-MM-dd',
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'yyyy/MM/dd',
      'MMM dd, yyyy',
      'MMMM dd, yyyy',
    ];

    for (const formatStr of formats) {
      try {
        date = parse(dateString, formatStr, new Date());
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch {
        continue;
      }
    }

    throw new Error('Unable to parse date string');
  } catch (error) {
    console.error('Error parsing date:', error);
    throw new Error(`Invalid date string: ${dateString}`);
  }
}

/**
 * Formats a date as a relative string (e.g., "Today", "Yesterday", "2 days ago")
 * @param date - The date to format (ISO string or Date object)
 * @returns Relative date string
 */
export function formatRelativeDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseDate(date) : date;

    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    // Check if today
    if (isToday(dateObj)) {
      return 'Today';
    }

    // Check if yesterday
    if (isYesterday(dateObj)) {
      return 'Yesterday';
    }

    // Calculate difference in days
    const daysDiff = differenceInDays(new Date(), dateObj);

    // For dates within the past week
    if (daysDiff > 0 && daysDiff <= 7) {
      return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
    }

    // For dates within the past month
    if (daysDiff > 7 && daysDiff <= 30) {
      const weeks = Math.floor(daysDiff / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }

    // For dates within the past year
    if (daysDiff > 30 && daysDiff <= 365) {
      const months = Math.floor(daysDiff / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }

    // For dates more than a year ago
    if (daysDiff > 365) {
      const years = Math.floor(daysDiff / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }

    // For future dates
    if (daysDiff < 0) {
      return formatDate(dateObj, 'MMM dd, yyyy');
    }

    // Fallback to date-fns formatDistanceToNow
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return formatDate(date, 'MMM dd, yyyy');
  }
}
