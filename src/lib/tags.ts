/**
 * Normalizes a tag string by converting to lowercase and replacing spaces with hyphens.
 * Example: "Hello World" -> "hello-world"
 */
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}
