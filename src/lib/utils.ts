import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a localized string.
 * Will be enhanced later to use the user's preferred language.
 */
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

/**
 * Generates a tracking ID for incidents (e.g., ML-1042)
 */
export function generateTrackingId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ML-${randomNum}`;
}