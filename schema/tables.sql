CREATE TYPE course_status AS ENUM (
  'coming-soon',
  'in-progress',
  'available'
);

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  github_username VARCHAR(255),
  avatar_url TEXT,
  followers_count INTEGER
);

CREATE TABLE courses (
  course_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  status course_status, 
  price_id VARCHAR(255)
);

CREATE TABLE courseenrollments (
  enrollment_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES Courses(course_id),
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

CREATE TABLE stripepayments (
  payment_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10, 2),
  payment_status VARCHAR(50),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NextAuth tables for authentication and session management
CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE accounts
(
  id SERIAL,
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
  token_type TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL REFERENCES users(id),
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE articlepurchases (
  purchase_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  article_slug VARCHAR(255),
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10, 2),
  UNIQUE(user_id, article_slug)
);

