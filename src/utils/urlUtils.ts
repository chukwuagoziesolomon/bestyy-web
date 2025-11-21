/**
 * URL Utility Functions
 * Handles conversion between vendor names, slugs, and IDs
 */

/**
 * Convert vendor name to URL-friendly slug
 * Example: "KFC Nigeria" -> "kfc-nigeria"
 */
export function createVendorSlug(businessName: string, vendorId: number): string {
  const slug = businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  // Append ID at the end for uniqueness: "kfc-nigeria-123"
  return `${slug}-${vendorId}`;
}

/**
 * Extract vendor ID from slug
 * Example: "kfc-nigeria-123" -> 123
 */
export function getVendorIdFromSlug(slug: string): number | null {
  // Check if it's already a plain number (legacy support)
  if (/^\d+$/.test(slug)) {
    return parseInt(slug, 10);
  }
  
  // Extract ID from end of slug: "kfc-nigeria-123" -> 123
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Generate vendor profile URL
 */
export function getVendorProfileUrl(businessName: string, vendorId: number): string {
  const slug = createVendorSlug(businessName, vendorId);
  return `/vendor/${slug}`;
}

/**
 * Validate if a slug is properly formatted
 */
export function isValidVendorSlug(slug: string): boolean {
  // Allow plain numbers (legacy) or properly formatted slugs ending with -ID
  return /^\d+$/.test(slug) || /^[a-z0-9-]+-\d+$/.test(slug);
}
