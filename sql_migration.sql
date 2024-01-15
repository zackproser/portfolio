-- Drop tables if they exist
DROP TABLE IF EXISTS Students, Courses, CourseEnrollments, StripePayments, Logins;

-- Create updated tables
CREATE TABLE Students (
  student_id SERIAL PRIMARY KEY,
  github_username VARCHAR(255),
  email VARCHAR(255) UNIQUE, 
  avatar_url TEXT,
  followers_count INTEGER
);

CREATE TABLE Courses (
  course_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT  
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

-- Populate courses
INSERT INTO Courses (title, description)
VALUES
  (
    'React Fundamentals', 
    'Dive into React basics and build robust web apps'
  ),
  (
    'Node.js Essentials',
    'Learn the fundamentals of backend dev with Node.js'
  ),
  (
    'Containerizing Applications with Docker', 
    'Deploy applications seamlessly using Docker containerization.'
  ),
  ( 
    'Full-Stack JavaScript: From Front to Back', 
    'Become a full-stack developer mastering JavaScript ecosystems.'
  );

