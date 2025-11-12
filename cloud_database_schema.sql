-- Full Database Schema for PlanetScale Deployment
-- PlanetScale uses MySQL 8.0 compatible syntax
-- Foreign key constraints are NOT supported in PlanetScale (uses vitess)
-- Timestamps use automatic defaults

-- Drop existing tables if they exist
DROP TABLE IF EXISTS otp_tokens;
DROP TABLE IF EXISTS senior_feedback;
DROP TABLE IF EXISTS student_feedback;
DROP TABLE IF EXISTS student_interests;
DROP TABLE IF EXISTS student_certifications;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS senior_requests;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS seniors;
DROP TABLE IF EXISTS students;

-- Students table
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  college VARCHAR(255),
  year INT,
  branch VARCHAR(255),
  profile_picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_email (email),
  KEY idx_phone (phone)
);

-- Seniors table
CREATE TABLE seniors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  age INT,
  profile_picture VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_email (email),
  KEY idx_phone (phone)
);

-- Requests table (NO FOREIGN KEY for PlanetScale compatibility)
CREATE TABLE requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  senior_id INT NOT NULL,
  student_id INT,
  task_description TEXT NOT NULL,
  status ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_senior (senior_id),
  KEY idx_student (student_id),
  KEY idx_status (status),
  KEY idx_created (created_at)
);

-- Senior Requests table (NO FOREIGN KEY for PlanetScale)
CREATE TABLE senior_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  senior_id INT NOT NULL,
  student_id INT,
  request_text TEXT NOT NULL,
  status ENUM('pending', 'accepted', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_senior_id (senior_id),
  KEY idx_student_id (student_id),
  KEY idx_status (status)
);

-- Donations table (NO FOREIGN KEY for PlanetScale)
CREATE TABLE donations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_student (student_id),
  KEY idx_date (date)
);

-- Student Interests table (NO FOREIGN KEY for PlanetScale)
CREATE TABLE student_interests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  interests TEXT,
  skills TEXT,
  availability TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_student_interest (student_id)
);

-- Student Certifications table (NO FOREIGN KEY for PlanetScale)
CREATE TABLE student_certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  certification_name VARCHAR(255) NOT NULL,
  issued_by VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  credential_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_student (student_id)
);

-- Student Feedback table (NO FOREIGN KEY for PlanetScale)
CREATE TABLE student_feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  request_id INT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_student (student_id),
  KEY idx_request (request_id),
  KEY idx_rating (rating)
);

-- Senior Feedback table (NO FOREIGN KEY for PlanetScale)
CREATE TABLE senior_feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  senior_id INT NOT NULL,
  request_id INT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  feedback_text TEXT,
  feedback_type VARCHAR(50),
  additional_comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_senior (senior_id),
  KEY idx_request (request_id),
  KEY idx_rating (rating),
  KEY idx_type (feedback_type)
);

-- OTP Tokens table
CREATE TABLE otp_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  purpose ENUM('reset', 'registration') DEFAULT 'reset',
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_email (email),
  KEY idx_code (code),
  KEY idx_expires (expires_at)
);

-- Schema is PlanetScale compatible (no foreign keys)
-- Ready for deployment!
