-- Create course status enum if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_status') THEN
        CREATE TYPE course_status AS ENUM (
            'coming-soon',
            'in-progress',
            'available'
        );
    END IF;
END $$;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    github_username VARCHAR(255),
    avatar_url TEXT,
    followers_count INTEGER
);

-- Create verification token table if it doesn't exist
CREATE TABLE IF NOT EXISTS verification_token (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Create accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id),
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    id_token TEXT,
    scope TEXT,
    session_state TEXT,
    token_type TEXT
);

-- Create sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id),
    expires TIMESTAMPTZ NOT NULL,
    "sessionToken" VARCHAR(255) NOT NULL
);

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    status course_status,
    price_id VARCHAR(255)
);

-- Create courseenrollments table if it doesn't exist
CREATE TABLE IF NOT EXISTS courseenrollments (
    enrollment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_id INTEGER REFERENCES courses(course_id),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Create stripepayments table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripepayments (
    payment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stripe_payment_id VARCHAR(255),
    amount DECIMAL(10, 2),
    payment_status VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create articlepurchases table if it doesn't exist
CREATE TABLE IF NOT EXISTS articlepurchases (
    purchase_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    article_slug VARCHAR(255),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_id VARCHAR(255),
    amount DECIMAL(10, 2),
    UNIQUE(user_id, article_slug)
);

-- Create coursepurchases table if it doesn't exist
CREATE TABLE IF NOT EXISTS coursepurchases (
    purchase_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_slug VARCHAR(255),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_id VARCHAR(255),
    amount DECIMAL(10, 2),
    UNIQUE(user_id, course_slug)
);

-- Create email_notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('article', 'course')),
    content_slug VARCHAR(255) NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_type, content_slug, email_type)
);

-- Add any missing indexes
CREATE INDEX IF NOT EXISTS idx_article_purchases_user ON articlepurchases(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_user ON coursepurchases(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_user ON email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_content ON email_notifications(content_type, content_slug);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON courseenrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON courseenrollments(course_id); 