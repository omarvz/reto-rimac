-- MySQL Schemas for both PE and CL

CREATE DATABASE IF NOT EXISTS appointments_pe;
CREATE DATABASE IF NOT EXISTS appointments_cl;

-- For PE
USE appointments_pe;

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    insured_id VARCHAR(255) NOT NULL,
    schedule_id INT NOT NULL,
    country_iso CHAR(2) NOT NULL DEFAULT 'PE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_insured_id (insured_id),
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_created_at (created_at)
);

-- For CL
USE appointments_cl;

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    insured_id VARCHAR(255) NOT NULL,
    schedule_id INT NOT NULL,
    country_iso CHAR(2) NOT NULL DEFAULT 'CL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_insured_id (insured_id),
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_created_at (created_at)
);