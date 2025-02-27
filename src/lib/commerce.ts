import { Blog, isPurchasable, Purchasable, BlogWithSlug } from './shared-types';
import { getAllContentMetadata } from './getAllContentMetadata';
import path from 'path';
import glob from 'fast-glob';
import { ProductContent } from './types/product';
import { promises as fs } from 'fs';
import { getAllArticles, getArticleBySlug } from './articles-compat';
import { generateProductFromArticle, generateProductFromCourse } from './productGenerator';

// Get a purchasable item by its slug
export async function getPurchasableItem(slug: string): Promise<Purchasable | null> {
  try {
    // First try to find it in the content
    const [blogContent, courseContent, videoContent] = await Promise.all([
      getAllContentMetadata('blog'),
      getAllContentMetadata('learn/courses'),
      getAllContentMetadata('videos')
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
      getAllContentMetadata('blog'),
      getAllContentMetadata('learn/courses'),
      getAllContentMetadata('videos')
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

const PRODUCTS_DIRECTORY = path.join(process.cwd(), 'src/data/products');

// Get a product from static JSON files (for custom landing pages)
async function getStaticProductContent(slug: string): Promise<ProductContent | null> {
  try {
    const fullPath = path.join(PRODUCTS_DIRECTORY, `${slug}.json`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(fileContents) as ProductContent;
  } catch (error) {
    return null;
  }
}

// Get a product from an article or course
async function getDynamicProductContent(slug: string): Promise<ProductContent | null> {
  // First check if it's a blog post
  const article = await getArticleBySlug(slug);
  if (article) {
    if (article.commerce?.isPaid) {
      return generateProductFromArticle(article as BlogWithSlug);
    }
  }

  // Check if it's a course
  const courses = await getAllContentMetadata('learn/courses');
  const course = courses.find(c => c.slug === slug);
  if (course && isPurchasable(course)) {
    return generateProductFromArticle(course as Blog);
  }

  return null;
}

export async function getProductContent(slug: string): Promise<ProductContent | null> {
  // First try to get a static product page
  const staticProduct = await getStaticProductContent(slug);
  if (staticProduct) {
    return staticProduct;
  }

  // If no static page exists, try to generate one from an article or course
  return getDynamicProductContent(slug);
}

export async function getAllProducts(): Promise<ProductContent[]> {
  try {
    // Get all content
    const [blogContent, courseContent, videoContent] = await Promise.all([
      getAllContentMetadata('blog'),
      getAllContentMetadata('learn/courses'),
      getAllContentMetadata('videos')
    ]);

    // Get static product pages
    const files = await fs.readdir(PRODUCTS_DIRECTORY);
    const staticProducts = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const content = await getStaticProductContent(file.replace(/\.json$/, ''));
          return content;
        })
    );

    // Get paid articles
    const articles = await getAllArticles();
    const articleProducts = articles
      .filter(article => article.commerce?.isPaid)
      .map(article => generateProductFromArticle(article as BlogWithSlug));

    // TODO: Add course products when implemented
    // const courses = await getAllCourses();
    // const courseProducts = courses.map(course => generateProductFromCourse(course));

    // Combine all products
    const allProducts = [
      ...staticProducts,
      ...articleProducts,
      // ...courseProducts
    ].filter((p): p is ProductContent => p !== null);

    return allProducts;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Get all purchasable content
export async function getAllPurchasableContent(): Promise<Blog[]> {
  const allContent = await Promise.all([
    getAllContentMetadata('blog'),
    getAllContentMetadata('learn/courses'),
    getAllContentMetadata('videos')
  ]).then(results => results.flat());
  
  return allContent
    .filter((content) => 
      content.type !== 'demo' && isPurchasable(content)
    );
}

// Get a product by its slug
export async function getProductBySlug(slug: string): Promise<Purchasable | null> {
  // First check articles
  const article = await getArticleBySlug(slug);
  if (article && isPurchasable(article)) {
    return article;
  }

  // Check if it's a course
  const courses = await getAllContentMetadata('learn/courses');
  const course = courses.find(c => c.slug === slug);
  if (course && isPurchasable(course)) {
    return course;
  }

  return null;
} 