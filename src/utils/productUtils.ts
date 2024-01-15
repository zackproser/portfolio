import devProducts from './devProducts.json';
import prodProducts from './prodProducts.json';

interface ProductDetails {
  fullName: string;
  description: string;
  priceId: string;
}

interface Products {
  [key: string]: ProductDetails;
}

const isProduction = process.env.NODE_ENV === 'production';
const products: Products = isProduction ? prodProducts : devProducts;

export function getProductDetails(productName: string) {
  return products[productName] || null;
}

