# Purchasable Content Refactoring Notes

## Current State

The codebase has a complex system for handling purchasable content (articles, courses, etc.) with several interconnected pieces:

### Type Definitions
- `Article` interface in `shared-types.ts` handles both free and paid content
- Commerce-related fields are nested under an optional `commerce` property
- Landing page customization under optional `landing` property

### Key Files
1. `src/lib/products.ts` - Handles product generation and lookup
2. `src/lib/productGenerator.ts` - Converts articles/courses to product format
3. `src/lib/commerce.ts` - Manages purchasable items and user purchases
4. `src/lib/content.ts` - Core content loading and management
5. `src/lib/articles.ts` - Article-specific functionality

## Issues Identified

1. Type Inconsistencies:
   - `ArticleWithSlug` type referenced but not exported from shared-types.ts
   - Confusion between `Article`, `ArticleWithSlug`, and `Purchasable` types
   - Inconsistent handling of commerce fields between interfaces

2. Architectural Concerns:
   - Multiple systems for handling purchasable content (products.ts vs commerce.ts)
   - Duplicate product generation logic
   - Inconsistent approach to handling paid content metadata

3. API Issues:
   - Chat API route has incorrect type references
   - Potential issues with article context handling

## Required Changes

1. Type System Cleanup:
   ```typescript
   // In shared-types.ts
   export interface Article extends Content {
     type: 'blog' | 'tutorial' | 'course'
     commerce?: {
       isPaid: boolean
       price: number
       stripe_price_id?: string
       previewLength?: number
       // ... other commerce fields
     }
     landing?: {
       // ... landing page fields
     }
   }

   export type ArticleWithSlug = Article & { slug: string }
   export type Purchasable = Article & { commerce: NonNullable<Article['commerce']> }
   ```

2. Consolidate Product Handling:
   - Merge functionality from products.ts and commerce.ts
   - Single source of truth for product generation
   - Consistent handling of paid content metadata

3. API Updates:
   - Fix type references in chat API route
   - Ensure proper article context handling
   - Maintain existing functionality while fixing type issues

## Implementation Notes

1. The chat API route should maintain its current functionality while fixing type issues:
   ```typescript
   import { Article } from '@/lib/shared-types'
   // ... rest of the implementation remains unchanged
   ```

2. Product generation should be consolidated:
   - Move all product generation to commerce.ts
   - Deprecate separate product generation in products.ts
   - Ensure consistent typing throughout

3. Content loading should be streamlined:
   - Single pattern for loading purchasable content
   - Consistent error handling
   - Type-safe throughout the pipeline

## Next Steps

1. Fix immediate type issues in chat API route
2. Update shared-types.ts with proper type exports
3. Consolidate product handling logic
4. Update all consuming code to use new type system
5. Add tests to verify type safety and functionality

## Important Considerations

- Maintain backward compatibility with existing content
- Ensure proper handling of both free and paid content
- Keep existing functionality working while making type system improvements
- Consider impact on frontend components and data flow

## Migration Strategy

1. Add new types without removing old ones
2. Gradually migrate components to new type system
3. Update API routes one at a time
4. Add type safety tests
5. Remove deprecated types and functions

This refactor should focus on improving type safety and code organization while maintaining existing functionality. 