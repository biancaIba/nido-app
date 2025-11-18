import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

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
