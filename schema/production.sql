-- Drop tables if they exist
DROP TABLE IF EXISTS Students, Courses, CourseEnrollments, StripePayments, Logins;

-- Create ENUM type for course status
CREATE TYPE course_status AS ENUM (
  'coming-soon',
  'in-progress',
  'available'
);

CREATE TABLE Students (
  student_id SERIAL PRIMARY KEY,
  github_username VARCHAR(255),
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE, 
  avatar_url TEXT,
  followers_count INTEGER
);

CREATE TABLE Courses (
  course_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  status course_status, -- Using ENUM type
  price_id VARCHAR(255)
);

CREATE TABLE CourseEnrollments (
  enrollment_id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES Students(student_id),
  course_id INTEGER REFERENCES Courses(course_id),
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id)
);

CREATE TABLE StripePayments (
  payment_id SERIAL PRIMARY KEY, 
  student_id INTEGER REFERENCES Students(student_id),
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10, 2),
  payment_status VARCHAR(50),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Logins (
  login_id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES Students(student_id), 
  login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Populate Production courses
INSERT INTO Courses (title, description, slug, status, price_id)
VALUES
  (
    'Emotional Intelligence for Developers',
    'Develop emotional intelligence skills specifically tailored for software developers',
    'emotional-intelligence-for-developers',
    'coming-soon',
    'price_1OfOHoEDHFkvZ1e9ko2iI54Z'
  ),
  (
    'Git Going',
    'The only course you need to become proficient using git',
    'git-going',
    'available',
    'price_1OfOEBEDHFkvZ1e9CnStOFqZ'
  ),
  (
    'Coming Out of Your Shell',
    'Mastering the shell for effective software development',
    'coming-out-of-your-shell',
    'coming-soon',
    'price_1OfOIkEDHFkvZ1e9KRUkmryG' 
  ),
  (
    'GitHub Automations',
    'Automate your workflow with GitHub Actions and more',
    'github-automations',
    'coming-soon',
    'price_1OfOJQEDHFkvZ1e99P8h4iIM' 
  ),
  (
    'Infrastructure as Code',
    'Leveraging IaC for efficient and reliable software deployment',
    'infrastructure-as-code',
    'coming-soon',
    'price_1OfOKEEDHFkvZ1e9S29zTPdG' 
  ),
  (
    'Pair Coding with AI',
    'Enhancing your coding skills with AI assistance',
    'pair-coding-with-ai',
    'coming-soon',
    'price_1OfOL3EDHFkvZ1e9yizwCLPg' 
  ),
  (
    'Taking Command',
    'Command line proficiency for modern developers',
    'taking-command',
    'coming-soon',
    'price_1OfOLREDHFkvZ1e9ESr6WE1S' 
  ),
  (
    'Your First Full-Stack App',
    'Building a full-stack application from scratch',
    'your-first-full-stack-app',
    'coming-soon',
    'price_1OfOLkEDHFkvZ1e9CZHlmh6E' 
  );
