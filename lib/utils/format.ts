import { formatDistanceToNowStrict, format } from "date-fns";

export function formatRelativeDate(value: string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function estimateTokens(content: string) {
  return Math.ceil(content.length / 4);
}
