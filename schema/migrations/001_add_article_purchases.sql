CREATE TABLE IF NOT EXISTS articlepurchases (
  purchase_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  article_slug VARCHAR(255),
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10, 2),
  UNIQUE(user_id, article_slug)
); 