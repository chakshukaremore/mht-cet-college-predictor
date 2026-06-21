-- MHT CET College Recommendation & Admission Analytics System
-- Database Schema Initialization (MySQL)

CREATE DATABASE IF NOT EXISTS mht_cet_admission;
USE mht_cet_admission;

-- ============================================================================
-- 1. Table: colleges
-- ============================================================================
CREATE TABLE IF NOT EXISTS colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL COMMENT 'Unique DTE / MHT-CET College Code',
    name VARCHAR(255) NOT NULL COMMENT 'Full name of the college',
    city VARCHAR(100) NOT NULL COMMENT 'City location of the college',
    status VARCHAR(50) NOT NULL COMMENT 'Government / Govt. Aided / Private',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. Table: cutoffs
-- ============================================================================
CREATE TABLE IF NOT EXISTS cutoffs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    branch_code VARCHAR(20) NOT NULL COMMENT 'DTE Choice Code (e.g., 301224210)',
    branch_name VARCHAR(255) NOT NULL COMMENT 'Engineering branch name (e.g., Computer Engineering)',
    year INT NOT NULL COMMENT 'Admission year (e.g., 2023, 2024)',
    round INT NOT NULL COMMENT 'CAP Round number (e.g., 1, 2, 3)',
    category VARCHAR(50) NOT NULL COMMENT 'Reservation category (e.g., OPEN, OBC, SC, ST, EWS, TFWS)',
    cutoff_percentile DECIMAL(7, 4) NOT NULL COMMENT 'High-precision cutoff percentile (e.g., 99.8542)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. Indexes for Query Performance & Optimization
-- ============================================================================

-- Speed up query for college recommendation by category and percentile (Main prediction API)
CREATE INDEX idx_cutoffs_category_percentile 
ON cutoffs (category, cutoff_percentile);

-- Speed up joins from cutoff to college
CREATE INDEX idx_cutoffs_college_id 
ON cutoffs (college_id);

-- Speed up analytics filtering by year, round, and branch
CREATE INDEX idx_cutoffs_year_round_branch 
ON cutoffs (year, round, branch_name);


-- ============================================================================
-- 4. Sample Seed Data for Verification
-- ============================================================================

-- Inserting sample colleges
INSERT INTO colleges (code, name, city, status) VALUES
('3012', 'Veermata Jijabai Technological Institute (VJTI)', 'Mumbai', 'Government Aided'),
('6006', 'College of Engineering, Pune (COEP)', 'Pune', 'Government Aided'),
('6271', 'Pune Institute of Computer Technology (PICT)', 'Pune', 'Private'),
('3215', 'Sardar Patel Institute of Technology (SPIT)', 'Mumbai', 'Private'),
('6273', 'Vishwakarma Institute of Technology (VIT)', 'Pune', 'Private')
ON DUPLICATE KEY UPDATE name=VALUES(name), city=VALUES(city), status=VALUES(status);

-- Get the auto-increment IDs for insertion using subqueries
-- Sample Cutoff Data for Year 2024 (CAP Round 1)
INSERT INTO cutoffs (college_id, branch_code, branch_name, year, round, category, cutoff_percentile) VALUES
-- VJTI Mumbai
((SELECT id FROM colleges WHERE code = '3012'), '301224210', 'Computer Engineering', 2024, 1, 'OPEN', 99.9213),
((SELECT id FROM colleges WHERE code = '3012'), '301224210', 'Computer Engineering', 2024, 1, 'OBC', 99.7845),
((SELECT id FROM colleges WHERE code = '3012'), '301224210', 'Computer Engineering', 2024, 1, 'SC', 98.9210),
((SELECT id FROM colleges WHERE code = '3012'), '301224210', 'Computer Engineering', 2024, 1, 'TFWS', 99.9512),
((SELECT id FROM colleges WHERE code = '3012'), '301224610', 'Information Technology', 2024, 1, 'OPEN', 99.8124),
((SELECT id FROM colleges WHERE code = '3012'), '301224610', 'Information Technology', 2024, 1, 'OBC', 99.6210),

-- COEP Pune
((SELECT id FROM colleges WHERE code = '6006'), '600624210', 'Computer Engineering', 2024, 1, 'OPEN', 99.8920),
((SELECT id FROM colleges WHERE code = '6006'), '600624210', 'Computer Engineering', 2024, 1, 'OBC', 99.6912),
((SELECT id FROM colleges WHERE code = '6006'), '600624210', 'Computer Engineering', 2024, 1, 'SC', 98.7123),
((SELECT id FROM colleges WHERE code = '6006'), '600624210', 'Computer Engineering', 2024, 1, 'TFWS', 99.9102),
((SELECT id FROM colleges WHERE code = '6006'), '600637210', 'Electronics and Telecommunication Engineering', 2024, 1, 'OPEN', 99.4120),

-- SPIT Mumbai
((SELECT id FROM colleges WHERE code = '3215'), '321524210', 'Computer Engineering', 2024, 1, 'OPEN', 99.6841),
((SELECT id FROM colleges WHERE code = '3215'), '321524210', 'Computer Engineering', 2024, 1, 'OBC', 99.3120),
((SELECT id FROM colleges WHERE code = '3215'), '321524610', 'Information Technology', 2024, 1, 'OPEN', 99.5210),

-- PICT Pune
((SELECT id FROM colleges WHERE code = '6271'), '627124210', 'Computer Engineering', 2024, 1, 'OPEN', 99.6102),
((SELECT id FROM colleges WHERE code = '6271'), '627124210', 'Computer Engineering', 2024, 1, 'OBC', 99.2841),
((SELECT id FROM colleges WHERE code = '6271'), '627124210', 'Computer Engineering', 2024, 1, 'TFWS', 99.7890),
((SELECT id FROM colleges WHERE code = '6271'), '627124610', 'Information Technology', 2024, 1, 'OPEN', 99.4215),

-- VIT Pune
((SELECT id FROM colleges WHERE code = '6273'), '627324210', 'Computer Engineering', 2024, 1, 'OPEN', 98.9120),
((SELECT id FROM colleges WHERE code = '6273'), '627324210', 'Computer Engineering', 2024, 1, 'OBC', 98.4210),
((SELECT id FROM colleges WHERE code = '6273'), '627337210', 'Electronics and Telecommunication Engineering', 2024, 1, 'OPEN', 97.8942)
ON DUPLICATE KEY UPDATE cutoff_percentile=VALUES(cutoff_percentile);
