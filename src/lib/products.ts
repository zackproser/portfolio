// import { promises as fs } from 'fs';
// import path from 'path';
// import { ProductContent } from './types/product';
// import { getAllArticles } from './articles';
// import { generateProductFromArticle, generateProductFromCourse } from './productGenerator';
// import { ArticleWithSlug, CourseContent } from './shared-types';

// const PRODUCTS_DIRECTORY = path.join(process.cwd(), 'src/data/products');

// // Get a product from static JSON files (for custom landing pages)
// async function getStaticProductContent(slug: string): Promise<ProductContent | null> {
//   try {
//     const fullPath = path.join(PRODUCTS_DIRECTORY, `${slug}.json`);
//     const fileContents = await fs.readFile(fullPath, 'utf8');
//     return JSON.parse(fileContents) as ProductContent;
//   } catch (error) {
//     return null;
//   }
// }

// // Get a product from an article or course
// async function getDynamicProductContent(slug: string): Promise<ProductContent | null> {
//   // First check if it's a blog post
//   const articles = await getAllArticles([slug]);
//   if (articles.length > 0) {
//     const article = articles[0] as ArticleWithSlug;
//     if (article.isPaid) {
//       return generateProductFromArticle(article);
//     }
//   }

//   // TODO: Add course lookup logic here when implemented
//   // const course = await getCourse(slug);
//   // if (course) {
//   //   return generateProductFromCourse(course);
//   // }

//   return null;
// }

// export async function getProductContent(slug: string): Promise<ProductContent | null> {
//   // First try to get a static product page
//   const staticProduct = await getStaticProductContent(slug);
//   if (staticProduct) {
//     return staticProduct;
//   }

//   // If no static page exists, try to generate one from an article or course
//   return getDynamicProductContent(slug);
// }

// export async function getAllProducts(): Promise<ProductContent[]> {
//   try {
//     // Get static product pages
//     const files = await fs.readdir(PRODUCTS_DIRECTORY);
//     const staticProducts = await Promise.all(
//       files
//         .filter(file => file.endsWith('.json'))
//         .map(async file => {
//           const content = await getStaticProductContent(file.replace(/\.json$/, ''));
//           return content;
//         })
//     );

//     // Get paid articles
//     const articles = await getAllArticles();
//     const articleProducts = articles
//       .filter(article => article.isPaid)
//       .map(article => generateProductFromArticle(article as ArticleWithSlug));

//     // TODO: Add course products when implemented
//     // const courses = await getAllCourses();
//     // const courseProducts = courses.map(course => generateProductFromCourse(course));

//     // Combine all products
//     const allProducts = [
//       ...staticProducts,
//       ...articleProducts,
//       // ...courseProducts
//     ].filter((p): p is ProductContent => p !== null);

//     return allProducts;
//   } catch (error) {
//     console.error('Error loading products:', error);
//     return [];
//   }
// } 