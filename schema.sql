CREATE DATABASE venue_management;

use venue_management;

CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    type ENUM('club', 'department') NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    registration_number VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department_id INT, -- Stores the student's unique academic department
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES organizations(id) ON DELETE SET NULL
);

-- Handles club memberships AND representative privileges for both clubs/depts
CREATE TABLE organization_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    organization_id INT NOT NULL,
    role ENUM('member', 'representative', 'admin') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(user_id, organization_id)
);

CREATE TABLE venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- Added UNIQUE to prevent duplicate venues
    capacity INT,
    location VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE venue_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL, -- The club/dept booking the room
    requested_by INT NOT NULL,    -- The exact user filling out the form
    venue_id INT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    purpose TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    -- Data integrity constraint: prevents backward timelines
    CONSTRAINT check_event_times CHECK (start_time < end_time) 
);

CREATE TABLE approval_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    admin_id INT NOT NULL,
    action ENUM('approved', 'rejected'),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES venue_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);