-- Drop tables if they exist
DROP TABLE IF EXISTS Students, Courses, CourseEnrollments, StripePayments, Logins;

-- Create updated tables
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
  status VARCHAR(50),
  price_id VARCHAR(255) -- Assuming price_id is a string like 'price_1OYcgfEDHFkvZ1e9Y3hMbnff'
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

-- Populate test (dev/staging) courses
INSERT INTO Courses (title, description, slug, status, price_id)
VALUES
  (
    'Emotional Intelligence for Developers',
    'Develop emotional intelligence skills specifically tailored for software developers',
    'emotional-intelligence-for-developers',
    'coming-soon',
    'price_1OZK3DEDHFkvZ1e9wO7luQv7'
  ),
  (
    'Git Going',
    'The only course you need to become proficient using git',
    'git-going',
    'available',
    'price_1OYr2DEDHFkvZ1e9ZYPj31GO'
  ),
  (
    'Coming Out of Your Shell',
    'Mastering the shell for effective software development',
    'coming-out-of-your-shell',
    'coming-soon',
    'price_1OYdHGEDHFkvZ1e9vZ3l3eoX' 
  ),
  (
    'GitHub Automations',
    'Automate your workflow with GitHub Actions and more',
    'github-automations',
    'coming-soon',
    'price_1OYdGtEDHFkvZ1e9ROX5hHDj' 
  ),
  (
    'Infrastructure as Code',
    'Leveraging IaC for efficient and reliable software deployment',
    'infrastructure-as-code',
    'coming-soon',
    'price_1OYcgfEDHFkvZ1e9Y3hMbnff' 
  ),
  (
    'Pair Coding with AI',
    'Enhancing your coding skills with AI assistance',
    'pair-coding-with-ai',
    'coming-soon',
    'price_1OYaktEDHFkvZ1e9OIvcUsdD' 
  ),
  (
    'Taking Command',
    'Command line proficiency for modern developers',
    'taking-command',
    'coming-soon',
    'price_1OZKFCEDHFkvZ1e96lcLdQAG' 
  ),
  (
    'Your First Full-Stack App',
    'Building a full-stack application from scratch',
    'your-first-full-stack-app',
    'coming-soon',
    'price_1OZKGREDHFkvZ1e92Jb4Mq5K' 
  );
