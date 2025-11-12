-- Full Database Schema for PostgreSQL Deployment
-- Foreign key constraints are supported in PostgreSQL

-- Drop existing tables if they exist
DROP TABLE IF EXISTS otp_tokens CASCADE;
DROP TABLE IF EXISTS senior_feedback CASCADE;
DROP TABLE IF EXISTS student_feedback CASCADE;
DROP TABLE IF EXISTS student_interests CASCADE;
DROP TABLE IF EXISTS student_certifications CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS senior_requests CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS seniors CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  college VARCHAR(255),
  year INTEGER,
  branch VARCHAR(255),
  profile_picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seniors table
CREATE TABLE seniors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  age INTEGER,
  profile_picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests table
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  senior_id INTEGER NOT NULL,
  student_id INTEGER,
  task_description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- Senior Requests table
CREATE TABLE senior_requests (
  id SERIAL PRIMARY KEY,
  senior_id INTEGER NOT NULL,
  student_id INTEGER,
  request_text TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- Donations table
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Student Interests table
CREATE TABLE student_interests (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  interests TEXT,
  skills TEXT,
  availability TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE(student_id)
);

-- Student Certifications table
CREATE TABLE student_certifications (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  certification_name VARCHAR(255) NOT NULL,
  issued_by VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Student Feedback table
CREATE TABLE student_feedback (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  request_id INTEGER,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE
);

-- Senior Feedback table
CREATE TABLE senior_feedback (
  id SERIAL PRIMARY KEY,
  senior_id INTEGER NOT NULL,
  request_id INTEGER,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback_text TEXT,
  feedback_type VARCHAR(50),
  additional_comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senior_id) REFERENCES seniors(id) ON DELETE CASCADE,
  FOREIGN KEY (request_id) REFERENCES senior_requests(id) ON DELETE CASCADE
);

-- OTP Tokens table
CREATE TABLE otp_tokens (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  purpose VARCHAR(20) DEFAULT 'reset',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_phone ON students(phone);
CREATE INDEX idx_seniors_email ON seniors(email);
CREATE INDEX idx_seniors_phone ON seniors(phone);
CREATE INDEX idx_requests_senior ON requests(senior_id);
CREATE INDEX idx_requests_student ON requests(student_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_senior_requests_senior ON senior_requests(senior_id);
CREATE INDEX idx_senior_requests_student ON senior_requests(student_id);
CREATE INDEX idx_senior_requests_status ON senior_requests(status);
CREATE INDEX idx_donations_student ON donations(student_id);
CREATE INDEX idx_donations_date ON donations(date);
CREATE INDEX idx_otp_tokens_email ON otp_tokens(email);
CREATE INDEX idx_otp_tokens_code ON otp_tokens(code);
CREATE INDEX idx_otp_tokens_expires ON otp_tokens(expires_at);

-- Schema is PostgreSQL compatible with foreign keys
-- Ready for deployment!
