import { Content } from '@/types';

/**
 * Get the checkout URL for a given purchasable content item.
 * Returns null if the content is not purchasable or essential data is missing.
 * @param content The processed Content object
 * @returns The checkout URL string or null.
 */
export function getContentCheckoutUrl(content: Content): string | null {
  // Ensure content is valid and purchasable
  if (!content || !content.commerce?.isPaid || !content.directorySlug || !content.type) {
    console.warn('Cannot generate checkout URL: Content is not purchasable or missing directorySlug/type.', { 
      slug: content?.slug, 
      dirSlug: content?.directorySlug, 
      type: content?.type, 
      isPaid: content?.commerce?.isPaid 
    });
    return null;
  }

  // Use directorySlug for the product parameter
  const productSlug = content.directorySlug;
  const productType = content.type;

  // Construct the URL
  const checkoutUrl = `/checkout?product=${productSlug}&type=${productType}`;
  // console.debug(`Generated checkout URL for ${content.type}/${productSlug}: ${checkoutUrl}`); // Optional: use console.debug
  
  return checkoutUrl;
} 