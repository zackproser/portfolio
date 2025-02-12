import { Article, isPurchasable, Purchasable } from './shared-types';
import { getContentByType } from './content';
import path from 'path';
import glob from 'fast-glob';
import { ProductContent } from './types/product';
import { promises as fs } from 'fs';
import { getAllArticles } from './articles';
import { generateProductFromArticle, generateProductFromCourse } from './productGenerator';
import { ArticleWithSlug } from './shared-types';

// Get a purchasable item by its slug
export async function getPurchasableItem(slug: string): Promise<Purchasable | null> {
  try {
    // First try to find it in the content
    const [blogContent, tutorialContent, courseContent] = await Promise.all([
      getContentByType('blog'),
      getContentByType('tutorial'),
      getContentByType('course')
    ]);

    const allContent = [...blogContent, ...tutorialContent, ...courseContent];
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
    const [blogContent, tutorialContent, courseContent] = await Promise.all([
      getContentByType('blog'),
      getContentByType('tutorial'),
      getContentByType('course')
    ]);

    const allContent = [...blogContent, ...tutorialContent, ...courseContent];
    const purchasableContent = allContent.filter((content): content is Purchasable => 
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
      ...customProducts.filter((p): p is Purchasable => p !== null && isPurchasable(p))
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
  const articles = await getAllArticles([slug]);
  if (articles.length > 0) {
    const article = articles[0] as ArticleWithSlug;
    if (article.commerce?.isPaid) {
      return generateProductFromArticle(article);
    }
  }

  // TODO: Add course lookup logic here when implemented
  // const course = await getCourse(slug);
  // if (course) {
  //   return generateProductFromCourse(course);
  // }

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
      .map(article => generateProductFromArticle(article as ArticleWithSlug));

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