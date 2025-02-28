import { Blog, isPurchasable, Purchasable, BlogWithSlug, Content } from './shared-types';
import path from 'path';
import glob from 'fast-glob';
import { ProductContent } from './types/product';
import { promises as fs } from 'fs';
import { getAllContent, getContentBySlug } from './content-handlers';
import { generateProductFromArticle, generateProductFromCourse } from './productGenerator';

// Get a purchasable item by its slug
export async function getPurchasableItem(slug: string): Promise<Purchasable | null> {
  try {
    // First try to find it in the content
    const [blogContent, courseContent, videoContent] = await Promise.all([
      getAllContent('blog'),
      getAllContent('learn/courses'),
      getAllContent('videos')
    ]);

    const allContent = [...blogContent, ...courseContent, ...videoContent];
    const item = allContent.find(content => content.slug === slug);

    if (item && isPurchasable(item)) {
      return item;
    }

    // If not found in content, try custom product definitions
    const customProductPaths = await glob('*.json', {
      cwd: path.join(process.cwd(), 'src', 'data', 'products')
    });

    for (const productPath of customProductPaths) {
      if (productPath.replace('.json', '') === slug) {
        const { default: content } = await import(`@/data/products/${productPath}`);
        if (isPurchasable(content)) {
          return content;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error loading purchasable item ${slug}:`, error);
    return null;
  }
}

// Get all purchasable items
export async function getAllPurchasableItems(): Promise<Purchasable[]> {
  try {
    // Get all content
    const [blogContent, courseContent, videoContent] = await Promise.all([
      getAllContent('blog'),
      getAllContent('learn/courses'),
      getAllContent('videos')
    ]);

    const allContent = [...blogContent, ...courseContent, ...videoContent];
    const purchasableContent = allContent.filter((content) => 
      isPurchasable(content)
    );

    // Get any custom product definitions
    const customProductPaths = await glob('*.json', {
      cwd: path.join(process.cwd(), 'src', 'data', 'products')
    });

    const customProducts = await Promise.all(
      customProductPaths.map(async productPath => {
        try {
          const { default: content } = await import(`@/data/products/${productPath}`);
          return isPurchasable(content) ? content : null;
        } catch (error) {
          console.error(`Error loading custom product ${productPath}:`, error);
          return null;
        }
      })
    );

    return [
      ...purchasableContent,
      ...customProducts.filter((p) => p !== null && isPurchasable(p))
    ];
  } catch (error) {
    console.error('Error loading purchasable items:', error);
    return [];
  }
}

// Check if a user has purchased an item
export async function hasUserPurchased(userId: string, slug: string): Promise<boolean> {
  try {
    const item = await getPurchasableItem(slug);
    if (!item) return false;

    // TODO: Implement purchase check logic
    // This would typically query your database to check if the user has purchased this item
    return false;
  } catch (error) {
    console.error(`Error checking purchase for user ${userId}, item ${slug}:`, error);
    return false;
  }
}

// Get all products (any content with isPaid=true)
export async function getAllProducts(): Promise<ProductContent[]> {
  try {
    // Get all content
    const [blogContent, courseContent, videoContent] = await Promise.all([
      getAllContent('blog'),
      getAllContent('learn/courses'),
      getAllContent('videos')
    ]);

    // Combine all content
    const allContent = [...blogContent, ...courseContent, ...videoContent];
    
    // Filter to only paid content
    const paidContent = allContent.filter(content => content.commerce?.isPaid);
    
    // Transform to product content
    const productContent = paidContent.map(content => generateProductFromArticle(content as BlogWithSlug));
    
    return productContent.filter((p): p is ProductContent => p !== null);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Get all purchasable content
export async function getAllPurchasableContent(): Promise<Blog[]> {
  const allContent = await Promise.all([
    getAllContent('blog'),
    getAllContent('learn/courses'),
    getAllContent('videos')
  ]).then(results => results.flat());
  
  return allContent
    .filter((content) => 
      content.type !== 'demo' && isPurchasable(content)
    );
}

// Get a product by its slug - simplified to use getContentBySlug
export async function getProductBySlug(slug: string): Promise<Purchasable | null> {
  // Try to find the content in any content type
  for (const contentType of ['blog', 'learn/courses', 'videos']) {
    const content = await getContentBySlug(slug, contentType);
    
    if (content && content.metadata && content.metadata.commerce?.isPaid) {
      // Transform to match the expected Purchasable structure
      const transformedContent = {
        ...content.metadata,
        MdxContent: content.MdxContent,
        type: content.metadata.type || contentType
      } as unknown as Purchasable;
      
      return transformedContent;
    }
  }

  return null;
} 