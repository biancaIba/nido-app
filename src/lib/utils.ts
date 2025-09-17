import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and Tailwind classes efficiently
 * Handles conditional classes, merges Tailwind utility classes properly
 * @param inputs - Class name(s) to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
