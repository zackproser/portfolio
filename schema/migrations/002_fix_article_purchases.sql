-- Drop the table if it exists and recreate it with the correct structure
DROP TABLE IF EXISTS articlepurchases;

CREATE TABLE articlepurchases (
  purchase_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  article_slug VARCHAR(255) NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10, 2),
  UNIQUE(user_id, article_slug)
);

-- Add an index for faster lookups
CREATE INDEX idx_articlepurchases_user_slug ON articlepurchases(user_id, article_slug); 