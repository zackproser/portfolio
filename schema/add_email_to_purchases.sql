-- Add email column to articlepurchases table if it doesn't exist
ALTER TABLE IF EXISTS articlepurchases 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add email column to coursepurchases table if it doesn't exist
ALTER TABLE IF EXISTS coursepurchases 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add email column to stripepayments table if it doesn't exist
ALTER TABLE IF EXISTS stripepayments 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add email column to email_notifications table if it doesn't exist
ALTER TABLE IF EXISTS email_notifications 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Create indexes for email lookups
CREATE INDEX IF NOT EXISTS idx_article_purchases_email ON articlepurchases(email);
CREATE INDEX IF NOT EXISTS idx_course_purchases_email ON coursepurchases(email);
CREATE INDEX IF NOT EXISTS idx_email_notifications_email ON email_notifications(email);

-- Add unique constraint for email and article_slug
ALTER TABLE articlepurchases 
DROP CONSTRAINT IF EXISTS articlepurchases_email_article_slug_key;

ALTER TABLE articlepurchases 
ADD CONSTRAINT articlepurchases_email_article_slug_key 
UNIQUE (email, article_slug) 
WHERE email IS NOT NULL;

-- Add unique constraint for email and course_slug
ALTER TABLE coursepurchases 
DROP CONSTRAINT IF EXISTS coursepurchases_email_course_slug_key;

ALTER TABLE coursepurchases 
ADD CONSTRAINT coursepurchases_email_course_slug_key 
UNIQUE (email, course_slug) 
WHERE email IS NOT NULL;

-- Add unique constraint for email, content_type, content_slug, and email_type
ALTER TABLE email_notifications 
DROP CONSTRAINT IF EXISTS email_notifications_email_content_type_content_slug_email_type_key;

ALTER TABLE email_notifications 
ADD CONSTRAINT email_notifications_email_content_type_content_slug_email_type_key 
UNIQUE (email, content_type, content_slug, email_type) 
WHERE email IS NOT NULL; 