CREATE DATABASE IF NOT EXISTS city_pulse_db;
USE city_pulse_db;

CREATE TABLE IF NOT EXISTS Startups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sector ENUM('SaaS', 'Hardware', 'BioTech', 'FinTech', 'CleanTech') NOT NULL,
    stage ENUM('Ideation', 'MVP', 'Seed', 'Scale') NOT NULL,
    location_district VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Government_Schemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    criteria_json JSON NOT NULL,
    funding_amount DECIMAL(15, 2) NOT NULL
);

-- Seed Data: Insert Startup ID 1
INSERT INTO Startups (name, sector, stage, location_district) 
VALUES ('AeroScale Technologies', 'Hardware', 'Seed', 'Innovation District');

-- Seed Data: Insert Government Schemes
INSERT INTO Government_Schemes (title, criteria_json, funding_amount) VALUES 
('Municipal Hardware Innovation Grant', '{"targetSector": "Hardware", "targetStage": "Seed"}', 150000.00),
('Digital City SaaS Accelerator', '{"targetSector": "SaaS", "targetStage": "MVP"}', 50000.00),
('Green Future Manufacturing Subsidy', '{"targetSector": "Hardware", "targetStage": "Scale"}', 250000.00),
('FinTech Regulatory Sandbox Fund', '{"targetSector": "FinTech", "targetStage": "Seed"}', 75000.00);