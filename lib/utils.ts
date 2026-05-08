import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date range string with a hyphen separator for ATS compatibility.
 * Uses ASCII hyphen-minus (-) instead of en-dash for reliable PDF text extraction.
 */
export function formatDateRange(dateString: string | undefined | null): string {
  if (!dateString) return '';

  // Normalize any existing dashes (en-dash, em-dash) to hyphen-minus for ATS compatibility
  let formatted = dateString.replace(/[–—]/g, '-');

  // Normalize spacing around existing hyphens
  formatted = formatted.replace(/\s*-\s*/g, ' - ');

  // Handle "Jun 2025 Aug 2025" pattern (month year month year without separator)
  formatted = formatted.replace(/([A-Za-z]+\.?\s+\d{4})\s+([A-Za-z]+\.?\s+\d{4})/g, '$1 - $2');

  // Handle "2023 2025" pattern (year year without separator)
  formatted = formatted.replace(/(\d{4})\s+(\d{4})/g, '$1 - $2');

  // Handle "Jun 2025 Present" pattern
  formatted = formatted.replace(
    /([A-Za-z]+\.?\s+\d{4})\s+(Present|Current|Now|Ongoing)/gi,
    '$1 - $2'
  );

  return formatted;
}
