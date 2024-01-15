-- Students Table
CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY,
    github_username VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE
);

-- Courses Table
CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

-- Course Enrollments Table
CREATE TABLE CourseEnrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES Students(student_id),
    course_id INTEGER REFERENCES Courses(course_id),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- Stripe Payments Table
CREATE TABLE StripePayments (
    payment_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES Students(student_id),
    stripe_payment_id VARCHAR(255),
    amount DECIMAL(10, 2),
    payment_status VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logins Table
CREATE TABLE Logins (
    login_id SERIAL PRIMARY KEY,
    github_username VARCHAR(255),
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GitHub Profiles Table (Unchanged)
CREATE TABLE GitHubProfiles (
    github_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES Students(student_id),
    avatar_url TEXT,
    followers_count INTEGER
);

