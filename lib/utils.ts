import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const portalLink = "https://apply.mbg.mn"


export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
}

// make youtube regular video long link to iframe
export const youtubeVideo = (link: string) => {
  const videoId = link.split("v=")[1];
  // Use privacy-enhanced mode to reduce third-party cookies
  return `https://www.youtube-nocookie.com/embed/${videoId}?controls=1&rel=0&playsinline=1&modestbranding=1`;
}

// Detect if the device is Windows
export const isWindows = () => {
  if (typeof window === 'undefined') return false;
  return /Windows/.test(navigator.userAgent);
}

// Conditionally show emoji based on platform
export const showEmoji = (emoji: string, fallback: string = '') => {
  return isWindows() ? fallback : emoji;
}