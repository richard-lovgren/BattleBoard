import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: Date): string {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formattedDate;
}

export function getCompetitonTypeIcon(type: number) : string {
  if(type == 0) {
    return "/tournament.svg"
  }
  else if(type == 1) {
    return "/classic_mode_icon.svg"
  }
  else if(type == 2) {
    return "/rival_mode_icon.svg"
  }
  else {
    return "";
  }
}