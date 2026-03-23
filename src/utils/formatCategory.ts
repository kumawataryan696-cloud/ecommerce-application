/** Display label for API category strings (e.g. men's clothing → Men's Clothing). */
export function formatCategoryLabel(category: string): string {
  return category
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}
