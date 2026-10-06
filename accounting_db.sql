-- Rafon Ledger database schema and chart of accounts
-- Target database: MySQL 8.0+ / MariaDB 10.5+

CREATE DATABASE IF NOT EXISTS accounting_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE accounting_db;

CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(150) NOT NULL,
    category ENUM('Asset', 'Liability', 'Equity', 'Revenue', 'Expense') NOT NULL,
    normal_balance ENUM('Debit', 'Credit') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_accounts_code UNIQUE (code),
    CONSTRAINT uq_accounts_title UNIQUE (title)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS journal_entries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    entry_date DATE NOT NULL,
    reference_number VARCHAR(50) NOT NULL,
    explanation VARCHAR(500) NOT NULL,
    status ENUM('POSTED', 'VOID') NOT NULL DEFAULT 'POSTED',
    created_by VARCHAR(100) NOT NULL DEFAULT 'Senior Accountant',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_journal_entries_reference UNIQUE (reference_number),
    INDEX idx_journal_entries_date (entry_date),
    INDEX idx_journal_entries_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS journal_lines (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    journal_entry_id BIGINT UNSIGNED NOT NULL,
    account_id BIGINT UNSIGNED NOT NULL,
    line_type ENUM('Debit', 'Credit') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_journal_lines_entry
        FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_journal_lines_account
        FOREIGN KEY (account_id) REFERENCES accounts(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT uq_journal_entry_line_type UNIQUE (journal_entry_id, line_type),
    CONSTRAINT chk_journal_lines_positive_amount CHECK (amount > 0),
    INDEX idx_journal_lines_account (account_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    reference_number VARCHAR(50) NOT NULL,
    details VARCHAR(500) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_logs_created_at (created_at),
    INDEX idx_audit_logs_reference (reference_number)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS restaurant_services (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500) NULL,
    icon_name VARCHAR(60) NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_restaurant_services_active_order (is_active, display_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(500) NULL,
    price DECIMAL(10,2) NOT NULL,
    image_path VARCHAR(500) NULL,
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_menu_items_price CHECK (price >= 0),
    INDEX idx_menu_items_active_order (is_active, display_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(500) NULL,
    contact_person VARCHAR(150) NULL,
    phone VARCHAR(50) NULL,
    email VARCHAR(190) NULL,
    address VARCHAR(500) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_suppliers_status_category (status, category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ingredient_usage (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(150) NOT NULL,
    details VARCHAR(255) NULL,
    usage_percentage DECIMAL(5,2) NOT NULL,
    recorded_on DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_ingredient_usage_percentage CHECK (usage_percentage >= 0 AND usage_percentage <= 100),
    INDEX idx_ingredient_usage_active_date (is_active, recorded_on),
    INDEX idx_ingredient_usage_percentage (usage_percentage)
) ENGINE=InnoDB;

INSERT INTO accounts (code, title, category, normal_balance) VALUES
    ('110', 'Cash on Hand & Bank', 'Asset', 'Debit'),
    ('120', 'Accounts Receivable', 'Asset', 'Debit'),
    ('130', 'Food & Beverage Inventory', 'Asset', 'Debit'),
    ('140', 'Prepaid Rent & Insurance', 'Asset', 'Debit'),
    ('151', 'Kitchen Equipment & Appliances', 'Asset', 'Debit'),
    ('210', 'Accounts Payable', 'Liability', 'Credit'),
    ('220', 'Utilities Payable', 'Liability', 'Credit'),
    ('310', 'Rafon, Capital', 'Equity', 'Credit'),
    ('320', 'Rafon, Drawing', 'Equity', 'Debit'),
    ('410', 'Restaurant & Seafood Sales', 'Revenue', 'Credit'),
    ('420', 'Catering Services Income', 'Revenue', 'Credit'),
    ('510', 'Cost of Seafood & Food Ingredients', 'Expense', 'Debit'),
    ('520', 'Salaries & Staff Wages Expense', 'Expense', 'Debit'),
    ('530', 'Utilities & Power Expense', 'Expense', 'Debit'),
    ('540', 'Rent Expense', 'Expense', 'Debit')
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    category = VALUES(category),
    normal_balance = VALUES(normal_balance),
    is_active = TRUE;
