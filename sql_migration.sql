-- Create 'students' table first as it is referenced by other tables
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    github_username VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Create 'billing' table, references 'students'
CREATE TABLE IF NOT EXISTS billing (
    billing_id SERIAL PRIMARY KEY,
    student_id INT UNIQUE NOT NULL,
    payment_method VARCHAR(255),
    subscription_status VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Add 'billing_id' to 'students' table as a foreign key
ALTER TABLE students ADD COLUMN IF NOT EXISTS billing_id INT;
ALTER TABLE students ADD CONSTRAINT fk_billing_id FOREIGN KEY (billing_id) REFERENCES billing(billing_id);

-- Create 'courses' table
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_mdx TEXT
);

-- Create 'github_profiles' table, references 'students'
CREATE TABLE IF NOT EXISTS github_profiles (
    github_id SERIAL PRIMARY KEY,
    github_username VARCHAR(255) UNIQUE NOT NULL,
    student_id INT UNIQUE NOT NULL,
    avatar_url TEXT,
    followers_count INT,
    -- Include other GitHub-related fields here
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Create 'course_progress' table, references 'students' and 'courses'
CREATE TABLE IF NOT EXISTS course_progress (
    progress_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    current_section INT,
    completed_sections JSON,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Create 'logins' table, references 'students' and 'github_profiles'
CREATE TABLE IF NOT EXISTS logins (
    login_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    github_username VARCHAR(255) NOT NULL,
    login_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
);
