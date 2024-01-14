-- Students Table
CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY,
    github_username VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    billing_id INTEGER -- Note: This will be removed as it's not needed anymore
);

-- Billing Table
CREATE TABLE Billing (
    billing_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES Students(student_id),
    payment_method VARCHAR(255),
    subscription_status VARCHAR(50)
);

-- Courses Table
CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    content_mdx TEXT -- Link to the MDX file for the course content
);

-- Course Progress Table
CREATE TABLE CourseProgress (
    progress_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES Students(student_id),
    course_id INTEGER REFERENCES Courses(course_id),
    current_section INTEGER,
    completed_sections JSON -- Stores completed sections
);

-- GitHub Profiles Table
CREATE TABLE GitHubProfiles (
    github_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES Students(student_id),
    avatar_url TEXT,
    followers_count INTEGER
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
    stripe_payment_id VARCHAR(255), -- Stripe's payment ID
    amount DECIMAL(10, 2), -- Total amount paid
    payment_status VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Indexes for faster queries (depending on your query patterns)
-- CREATE INDEX idx_student_email ON Students(email);
-- CREATE INDEX idx_course_title ON Courses(title);
-- CREATE INDEX idx_stripe_payment_status ON StripePayments(payment_status);

