import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null, currency: string | null): string {
  if (!price) return "Price not available";
  
  const currencySymbol = currency === "INR" ? "₹" : "$";
  return `${currencySymbol}${price.toLocaleString()}`;
}

export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove tracking parameters
    const cleanUrl = `${parsed.origin}${parsed.pathname}`;
    return cleanUrl;
  } catch {
    return url;
  }
}

export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getPriceBand(price: number | null): string {
  if (!price) return "Unknown";
  if (price < 10000) return "Under ₹10K";
  if (price < 25000) return "₹10K - ₹25K";
  if (price < 50000) return "₹25K - ₹50K";
  if (price < 100000) return "₹50K - ₹1L";
  return "Above ₹1L";
}
