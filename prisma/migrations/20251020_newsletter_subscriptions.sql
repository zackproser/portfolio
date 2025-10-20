-- Create newsletter_subscriptions table for local caching
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  source VARCHAR(100) DEFAULT 'website',
  subscribed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  emailoctopus_id TEXT,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_status ON newsletter_subscriptions(email, status);
CREATE INDEX idx_status ON newsletter_subscriptions(status);

-- Insert your email for immediate testing
INSERT INTO newsletter_subscriptions (email, status, source, subscribed_at)
VALUES ('zackproser@gmail.com', 'SUBSCRIBED', 'manual', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE
SET status = 'SUBSCRIBED', subscribed_at = CURRENT_TIMESTAMP;
