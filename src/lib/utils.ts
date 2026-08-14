import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BUN-${year}-${random}`;
}

export function getWhatsAppLink(message?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "905551234567";
  const text = encodeURIComponent(message || "Hello Bunited! I need help with studying in Türkiye.");
  return `https://wa.me/${number}?text=${text}`;
}
