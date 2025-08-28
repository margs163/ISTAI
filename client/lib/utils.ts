import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPreciseTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;

  // Handle future dates
  if (diffMs < 0) {
    return "in the future";
  }

  const units = [
    { name: "year", ms: 365 * 24 * 60 * 60 * 1000 },
    { name: "month", ms: 30 * 24 * 60 * 60 * 1000 },
    { name: "week", ms: 7 * 24 * 60 * 60 * 1000 },
    { name: "day", ms: 24 * 60 * 60 * 1000 },
    { name: "hour", ms: 60 * 60 * 1000 },
    { name: "minute", ms: 60 * 1000 },
    { name: "second", ms: 1000 },
  ];

  for (const unit of units) {
    const count = Math.floor(diffMs / unit.ms);
    if (count > 0) {
      return `${count} ${unit.name}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function getPreciseTimeFuture(dateString: string): string {
  const now = new Date();
  const future = new Date(dateString);
  const diffMs = future - now;

  // Handle future dates
  if (diffMs < 0) {
    return "in the future";
  }

  const units = [
    { name: "year", ms: 365 * 24 * 60 * 60 * 1000 },
    { name: "month", ms: 30 * 24 * 60 * 60 * 1000 },
    { name: "week", ms: 7 * 24 * 60 * 60 * 1000 },
    { name: "day", ms: 24 * 60 * 60 * 1000 },
    { name: "hour", ms: 60 * 60 * 1000 },
    { name: "minute", ms: 60 * 1000 },
    { name: "second", ms: 1000 },
  ];

  for (const unit of units) {
    const count = Math.floor(diffMs / unit.ms);
    if (count > 0) {
      return `${count} ${unit.name}${count > 1 ? "s" : ""}`;
    }
  }

  return "just now";
}

export function getLevel(score: number): string {
  return score <= 4
    ? "Elementary"
    : score >= 4.5 && score < 5.5
    ? "Intermediate"
    : score >= 5.5 && score < 7.0
    ? "Upper Intermediate"
    : score >= 7.0 && score < 8.5
    ? "Advanced"
    : "Proficient";
}

export function getLevelStyle(score: number): string {
  return score <= 4
    ? ""
    : score >= 4.5 && score < 5.5
    ? "text-red-600"
    : score >= 5.5 && score < 7.0
    ? "text-orange-600"
    : score >= 7.0 && score < 8.5
    ? "text-blue-600"
    : "text-purple-600";
}

export function parseTimeInt(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return `${minutes < 10 ? 0 : ""}${minutes}:${
    seconds < 10 ? 0 : ""
  }${seconds}`;
}

export function parseTimeString(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return `${minutes < 10 ? 0 : ""}${minutes} minutes ${
    seconds < 10 ? 0 : ""
  }${seconds} seconds`;
}

export function getSecondsDifference(date1: Date, date2: Date) {
  const diff = Math.abs(date2 - date1);
  return Math.floor(diff / 1000);
}
