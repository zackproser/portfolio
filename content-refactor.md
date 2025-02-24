# Content System Refactoring

## Core Changes

### 1. Base Content Class
```typescript
abstract class Content {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image?: string | StaticImageData;
  status: 'draft' | 'published' | 'archived';
  type: 'blog' | 'tutorial' | 'course' | 'demo';
  tags: string[];

  abstract getUrl(): string;
  abstract getSourcePath(): string;

  static async load(type: string, slug: string): Promise<Content>;
}
```

### 2. Article Implementation
```typescript
class Article extends Content {
  commerce?: {
    isPaid: true;
    price: number;
    stripe_price_id?: string;
    previewLength?: number;
    // ... other commerce fields
  };

  landing?: {
    subtitle?: string;
    features?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };

  getUrl(): string {
    return `/blog/${this.slug}`;
  }

  getSourcePath(): string {
    return path.join(Content.getWorkspacePath(), 'src/app/blog', this.slug, 'page.mdx');
  }

  static async fromSlug(slug: string): Promise<Article>;
  static async getAllArticles(): Promise<Article[]>;
}
```

## Benefits

### 1. Path Resolution
- Centralized path handling in content classes
- No more string manipulation in route handlers
- Consistent URL generation across the app

### 2. Type Safety
- Strong typing for all content properties
- Commerce fields properly typed and optional
- Better TypeScript inference in components

### 3. MDX Integration
- Clean MDX loading through class methods
- Maintains Next.js static optimization
- Proper error handling for missing content

## Route Simplification Examples

### 1. Checkout Sessions API
Before:
```typescript
if (type === 'blog' || type === 'article') {
  const articleContent = await importArticleMetadata(`${slug}/page.mdx`)
  if (!articleContent.commerce?.isPaid) {
    throw new Error('Not purchasable')
  }
  // Complex type casting and path manipulation
}
```

After:
```typescript
const content = await Content.load(type, slug)
if (!(content instanceof Purchasable)) {
  throw new Error('Content is not purchasable')
}
await content.createCheckoutSession(userId)
```

### 2. Blog Pages
Before:
```typescript
// Complex path manipulation and type casting
const { metadata } = await import(`@/app/blog/${slug}/page.mdx`)
const content = {
  ...metadata,
  type: 'blog',
  // Manual property assignment
}
```

After:
```typescript
const article = await Article.fromSlug(slug)
// All properties and methods available with type safety
```

## Next Steps

1. **Implement Purchasable Interface**
```typescript
interface Purchasable {
  commerce: {
    isPaid: true;
    price: number;
    stripe_price_id?: string;
  };
  
  createCheckoutSession(userId: string): Promise<string>;
  verifyPurchase(userId: string): Promise<boolean>;
  recordPurchase(userId: string): Promise<void>;
  sendPurchaseEmail(userId: string): Promise<void>;
}
```

2. **Add Loading States**
- Create loading.tsx files for routes
- Add skeleton components for streaming
- Implement proper Suspense boundaries

3. **Error Handling**
- Add error.tsx files for routes
- Implement proper error boundaries
- Add type-safe error handling in content classes

4. **Commerce Integration**
- Move Stripe logic into content classes
- Implement purchase verification
- Add email notification handling

5. **Testing**
- Add unit tests for content classes
- Add integration tests for commerce flows
- Test streaming and loading states

## Migration Strategy

1. **Phase 1: Core Classes** ✅
- Implement base Content class
- Create Article implementation
- Update blog routes

2. **Phase 2: Commerce**
- Implement Purchasable interface
- Move checkout logic to classes
- Update API routes

3. **Phase 3: Loading & Errors**
- Add loading states
- Implement error handling
- Add proper streaming

4. **Phase 4: Testing & Cleanup**
- Add test coverage
- Remove old code
- Update documentation

## Impact on Existing Features

### MDX Content
- No changes to MDX files needed
- Static generation still works
- Better error handling for missing content

### Commerce
- Simplified checkout flow
- Type-safe purchase handling
- Better separation of concerns

### Frontend
- Proper loading states
- Better error handling
- Streaming-ready components

## Notes

- Keep existing MDX files and structure
- Maintain Next.js 15+ compatibility
- Focus on type safety and maintainability
- Consider adding proper logging
- Document class methods and interfaces 