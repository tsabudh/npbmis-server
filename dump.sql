-- Active: 1677131859744@@localhost@5432@npbmis
-- Table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., Admin, Data Entry, Data Approver
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL, -- e.g., Draft, Verified, Approved
    type VARCHAR(50), -- e.g., New, Ongoing
    priority VARCHAR(50),
    identification_stage BOOLEAN DEFAULT FALSE,
    appraisal_stage BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the enum type for approval_status
CREATE TYPE approval_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Table for project approvals
CREATE TABLE project_approvals (
    approval_id SERIAL PRIMARY KEY,
    id INTEGER REFERENCES projects(id),
    approved_by INTEGER REFERENCES users(id),
    approval_status approval_status_enum NOT NULL,
    comments TEXT,
    approval_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for project files (documents)
CREATE TABLE project_files (
    file_id SERIAL PRIMARY KEY,
    id INTEGER REFERENCES projects(id),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_path VARCHAR(255) NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for project progress reports
CREATE TABLE progress_reports (
    report_id SERIAL PRIMARY KEY,
    id INTEGER REFERENCES projects(id),
    report_details TEXT NOT NULL,
    reported_by INTEGER REFERENCES users(id),
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for feedback
CREATE TABLE feedback (
    feedback_id SERIAL PRIMARY KEY,
    id INTEGER REFERENCES users(id),
    email VARCHAR(100),
    feedback_text TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for filters used in project search
CREATE TABLE project_filters (
    filter_id SERIAL PRIMARY KEY,
    filter_type VARCHAR(50) NOT NULL,
    filter_value VARCHAR(255) NOT NULL,
    id INTEGER REFERENCES users(id),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table for ministries
CREATE TABLE ministries (
    ministry_id SERIAL PRIMARY KEY,
    ministry_name VARCHAR(255) NOT NULL UNIQUE
);

-- Table for departments
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    ministry_id INTEGER REFERENCES ministries(ministry_id) ON DELETE CASCADE
);

