import { formatDistanceToNow, parseISO, format } from 'date-fns';

export const formatRelativeTime = (isoDateString: string): string => {
  try {
    const date = parseISO(isoDateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Recently';
  }
};

export const formatDateFormatted = (isoDateString: string): string => {
  try {
    const date = parseISO(isoDateString);
    return format(date, 'MMM d, yyyy • h:mm a');
  } catch (error) {
    return isoDateString;
  }
};

export const truncateText = (text: string, maxLength: number = 80): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const extractHashtags = (text: string): string[] => {
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches ? Array.from(new Set(matches)) : [];
};
