import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (firstName: string, lastName: string): string => {
  if (!firstName || !lastName) return '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};