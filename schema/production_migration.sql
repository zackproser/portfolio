-- Create article purchases table
CREATE TABLE IF NOT EXISTS articlepurchases (
    purchase_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    article_slug VARCHAR(255),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_id VARCHAR(255),
    amount DECIMAL(10, 2),
    UNIQUE(user_id, article_slug)
);

-- Create email notifications table with proper content type handling
CREATE TABLE IF NOT EXISTS email_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('article', 'course')),
    content_slug VARCHAR(255) NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_type, content_slug, email_type)
);

-- Create course purchases table
CREATE TABLE IF NOT EXISTS coursepurchases (
    purchase_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    course_slug VARCHAR(255),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_id VARCHAR(255),
    amount DECIMAL(10, 2),
    UNIQUE(user_id, course_slug)
); 