import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { intervalToDuration, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDurationBetweenDates = (startTime: Date, endTime: Date) => {
  const duration = intervalToDuration({ start: startTime, end: endTime });

  const hours = duration.hours ? String(duration.hours).padStart(2, '0') : '00';
  const minutes = duration.minutes ? String(duration.minutes).padStart(2, '0') : '00';
  const seconds = duration.seconds ? String(duration.seconds).padStart(2, '0') : '00';

  return `${hours}:${minutes}:${seconds}`;
}

export const formatDate = (date: string) => {
  return format(date, 'dd MMMM, yyyy hh:mm a');
};