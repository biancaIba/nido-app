import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

/**
 * Combines multiple class names and Tailwind classes efficiently
 * Handles conditional classes, merges Tailwind utility classes properly
 * @param inputs - Class name(s) to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a DiceBear avatar Data URI from a given seed.
 * @param seed The string used to generate the avatar.
 * @returns A Data URI string for the SVG avatar.
 */
export const generateAvatarUrl = (seed: string) => {
  if (!seed) return "";
  return createAvatar(adventurer, {
    seed,
    size: 128,
    radius: 50,
  }).toDataUri();
};

/**
 * Generates a short random string to be used as an avatar seed.
 * @returns A random string.
 */
export const generateRandomSeed = () => Math.random().toString(36).substring(7);

/**
 * Formats a date of birth that can be either a Timestamp or a string.
 * @param dateOfBirth - The date of birth as Timestamp or string
 * @param defaultValue - The default value to return if dateOfBirth is undefined
 * @returns A formatted date string (dd/MM/yyyy) or the default value
 */
export const formatDateOfBirth = (
  dateOfBirth: string | Timestamp | undefined,
  defaultValue: string = "No especificada"
): string => {
  if (!dateOfBirth) return defaultValue;

  if (dateOfBirth instanceof Timestamp) {
    return format(dateOfBirth.toDate(), "dd/MM/yyyy");
  }

  return dateOfBirth;
};
