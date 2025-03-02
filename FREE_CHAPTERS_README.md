# Free Chapters Feature

This feature allows users to request free chapters of premium content by providing their email address. It integrates with EmailOctopus for newsletter subscription and Postmark for sending the free chapters.

## How It Works

1. Users enter their email address in the `FreeChapters` component
2. The system checks if they've already requested free chapters for this product
3. If not, it subscribes them to the newsletter via EmailOctopus and tags them with the product
4. It records the request in the database using Prisma
5. It sends an email with links to the free chapters via Postmark
6. It updates the database to mark the request as fulfilled

## Components

- `FreeChapters.tsx`: The main component that displays the form and handles submission
- `FreeChaptersWrapper.tsx`: A wrapper component for easy integration into blog pages

## API Endpoints

- `/api/free-chapters`: Handles the free chapter request, subscribes the user, and sends the email
- `/api/check-free-chapters`: Checks if a user has already requested free chapters for a product

## Database

The feature uses a `FreeChapterRequest` model in Prisma with the following schema:

```prisma
model FreeChapterRequest {
  id            String    @id @default(cuid())
  userId        String?   @map("user_id")
  email         String
  productSlug   String    @map("product_slug")
  requestDate   DateTime  @default(now()) @map("request_date")
  fulfilled     Boolean   @default(false)
  fulfilledDate DateTime? @map("fulfilled_date")
  user          User?     @relation(fields: [userId], references: [id])

  @@unique([email, productSlug])
  @@index([email])
  @@index([productSlug])
  @@map("free_chapter_requests")
}
```

## Usage

To add the free chapters feature to a blog post, add the `FreeChaptersWrapper` component to the page:

```tsx
import FreeChaptersWrapper from '@/components/FreeChaptersWrapper'

// In your page component
<FreeChaptersWrapper 
  title="RAG Pipeline Tutorial" 
  productSlug="rag-pipeline-tutorial" 
/>
```

## Configuration

The feature requires the following environment variables:

- `EMAIL_OCTOPUS_API_KEY`: Your EmailOctopus API key
- `EMAIL_OCTOPUS_LIST_ID`: Your EmailOctopus list ID
- `POSTMARK_API_KEY`: Your Postmark API key
- `NEXT_PUBLIC_SITE_URL`: The base URL of your site
- `POSTGRES_PRISMA_URL`: Your Postgres database URL (used by Prisma)

## Deployment

To deploy the feature, you need to run Prisma migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

Or use the provided script:

```bash
node src/scripts/run-prisma-migration.js
```

## Future Improvements

1. Add a Postmark template for the free chapters email
2. Support actual PDF attachments instead of links
3. Add analytics to track open and click rates
4. Implement A/B testing for different email content
5. Add a way to manage and update the free chapters content
6. Create an admin interface to view and manage free chapter requests
7. Integrate with the user authentication system to associate free chapter requests with user accounts 