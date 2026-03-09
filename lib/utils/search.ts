import type { Prompt } from "@/types";

export function parseSearchTokens(query: string) {
  const exactMatches = Array.from(query.matchAll(/"([^"]+)"/g)).map((match) => match[1].toLowerCase());
  const tagMatches = Array.from(query.matchAll(/tag:([^\s]+)/g)).map((match) => match[1].toLowerCase());
  const modelMatches = Array.from(query.matchAll(/model:([^\s]+)/g)).map((match) => match[1].toLowerCase());
  const inTitle = Array.from(query.matchAll(/in:title\s+([^\s]+)/g)).map((match) => match[1].toLowerCase());
  const plain = query
    .replace(/"([^"]+)"/g, "")
    .replace(/tag:([^\s]+)/g, "")
    .replace(/model:([^\s]+)/g, "")
    .replace(/in:title\s+([^\s]+)/g, "")
    .trim()
    .toLowerCase();

  return { exactMatches, tagMatches, modelMatches, inTitle, plain };
}

export function matchesPrompt(prompt: Prompt, query?: string) {
  if (!query) {
    return true;
  }

  const haystack = [prompt.title, prompt.description, prompt.content, prompt.tags.join(" ")]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const { exactMatches, tagMatches, modelMatches, inTitle, plain } = parseSearchTokens(query);

  if (exactMatches.some((needle) => !haystack.includes(needle))) {
    return false;
  }

  if (tagMatches.some((tag) => !prompt.tags.map((entry) => entry.toLowerCase()).includes(tag))) {
    return false;
  }

  if (modelMatches.some((model) => !(prompt.model ?? "").toLowerCase().includes(model))) {
    return false;
  }

  if (inTitle.some((value) => !prompt.title.toLowerCase().includes(value))) {
    return false;
  }

  return plain ? haystack.includes(plain) : true;
}

export function highlightText(text: string, query?: string) {
  if (!query?.trim()) {
    return [{ text, match: false }];
  }

  const token = query.replace(/(tag|model):[^\s]+/g, "").replace(/in:title\s+[^\s]+/g, "").replace(/"/g, "").trim();

  if (!token) {
    return [{ text, match: false }];
  }

  const regex = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return text.split(regex).filter(Boolean).map((part) => ({ text: part, match: regex.test(part) }));
}
