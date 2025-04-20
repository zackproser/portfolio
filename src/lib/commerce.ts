/**
 * This file is maintained for backward compatibility.
 * All functionality has been moved to content-handlers.ts to reduce duplication.
 */

import {
  Content,
  Purchasable,
  ProductContent
} from '@/types';
import {
  getAllContent,
  getAllProducts,
  getAllPurchasableContent,
  getProductByDirectorySlug
} from './content-handlers';

export {
  hasUserPurchased,
  getAllProducts,
  getAllPurchasableContent,
  getProductByDirectorySlug
} from './content-handlers'; 