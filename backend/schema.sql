-- ARKO - Artifact and Document Preservation Database Schema
-- Aligned with ERD

CREATE DATABASE IF NOT EXISTS arko_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE arko_db;

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  roleID      VARCHAR(9)   NOT NULL PRIMARY KEY,
  roleName    ENUM('curator','staff','volunteer') NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  userID        VARCHAR(9)   NOT NULL PRIMARY KEY,
  roleID        VARCHAR(9)   NOT NULL,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  firstName     VARCHAR(50)  NOT NULL,
  middleName    VARCHAR(50)  DEFAULT NULL,
  lastName      VARCHAR(50)  NOT NULL,
  activeStatus  BOOLEAN      DEFAULT TRUE,
  password      VARCHAR(10)  NOT NULL,
  FOREIGN KEY (roleID) REFERENCES roles(roleID)
) ENGINE=InnoDB;

-- ============================================================
-- COLLECTIONS (externally owned – only collectionID referenced)
-- ============================================================
CREATE TABLE IF NOT EXISTS collections (
  collectionID    VARCHAR(15)  NOT NULL PRIMARY KEY,
  establishedDate DATETIME     DEFAULT NULL,
  userID          VARCHAR(9)   DEFAULT NULL,
  collectionName  VARCHAR(100) NOT NULL,
  type            ENUM('artifact','document','mixed') DEFAULT NULL,
  description     TEXT         DEFAULT NULL,
  notes           TEXT         DEFAULT NULL,
  status          ENUM('Active','Inactive','Archived') DEFAULT 'Active',
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS items (
  itemID           VARCHAR(15)  NOT NULL PRIMARY KEY,
  collectionID     VARCHAR(15)  DEFAULT NULL,
  itemName         VARCHAR(100) NOT NULL,
  acquisitionDate  DATETIME     DEFAULT NULL,
  description      TEXT         DEFAULT NULL,
  provenance       VARCHAR(255) DEFAULT NULL,
  height           DECIMAL(10,2) DEFAULT NULL,
  width            DECIMAL(10,2) DEFAULT NULL,
  length           DECIMAL(10,2) DEFAULT NULL,
  texture          VARCHAR(25)  DEFAULT NULL,
  color            VARCHAR(50)  DEFAULT NULL,
  remarks          VARCHAR(255) DEFAULT NULL,
  documentType     ENUM('Letter','Manuscript','Report','Certificate','Map','Newspaper','Book','Other') DEFAULT NULL,
  artifactType     ENUM('Pottery','Tool','Weapon','Textile','Jewelry','Painting','Sculpture','Other') DEFAULT NULL,
  authorFirstName  VARCHAR(50)  DEFAULT NULL,
  authorLastName   VARCHAR(50)  DEFAULT NULL,
  typeName         ENUM('artifact','document') NOT NULL,
  FOREIGN KEY (collectionID) REFERENCES collections(collectionID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- PROGRAMS (digitization plans)
-- ============================================================
CREATE TABLE IF NOT EXISTS programs (
  programID    VARCHAR(15)  NOT NULL PRIMARY KEY,
  userID       VARCHAR(9)   NOT NULL,
  projectName  VARCHAR(100) NOT NULL,
  description  TEXT         DEFAULT NULL,
  startDate    DATE         DEFAULT NULL,
  endDate      DATE         DEFAULT NULL,
  status       VARCHAR(20)  DEFAULT 'Active',
  planType     ENUM('collection-based','manual') DEFAULT 'manual',
  FOREIGN KEY (userID) REFERENCES users(userID)
) ENGINE=InnoDB;

-- ============================================================
-- PROGRAM_ASSIGNMENTS (staff assigned to programs)
-- ============================================================
CREATE TABLE IF NOT EXISTS program_assignments (
  assignmentID VARCHAR(15) NOT NULL PRIMARY KEY,
  programID    VARCHAR(15) NOT NULL,
  userID       VARCHAR(9)  NOT NULL,
  FOREIGN KEY (programID) REFERENCES programs(programID) ON DELETE CASCADE,
  FOREIGN KEY (userID)    REFERENCES users(userID) ON DELETE CASCADE,
  UNIQUE KEY uq_program_user (programID, userID)
) ENGINE=InnoDB;

-- ============================================================
-- PROGRAM_ITEMS (items linked to programs)
-- ============================================================
CREATE TABLE IF NOT EXISTS program_items (
  programItemID VARCHAR(15) NOT NULL PRIMARY KEY,
  programID     VARCHAR(15) NOT NULL,
  itemID        VARCHAR(15) NOT NULL,
  FOREIGN KEY (programID) REFERENCES programs(programID) ON DELETE CASCADE,
  FOREIGN KEY (itemID)    REFERENCES items(itemID) ON DELETE CASCADE,
  UNIQUE KEY uq_program_item (programID, itemID)
) ENGINE=InnoDB;

-- ============================================================
-- DIGITAL_ASSETS (scanned / uploaded files)
-- ============================================================
CREATE TABLE IF NOT EXISTS digital_assets (
  assetID         VARCHAR(15)   NOT NULL PRIMARY KEY,
  itemID          VARCHAR(15)   NOT NULL,
  programID       VARCHAR(15)   DEFAULT NULL,
  userID          VARCHAR(9)    NOT NULL,
  fileName        TEXT          NOT NULL,
  fileSize        DECIMAL(10,2) DEFAULT NULL,
  filePath        TEXT          NOT NULL,
  uploadTimestamp TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  resolution      VARCHAR(50)   DEFAULT NULL,
  numFiles        INT           DEFAULT NULL,
  fileFormat      VARCHAR(5)    DEFAULT NULL,
  FOREIGN KEY (itemID)    REFERENCES items(itemID),
  FOREIGN KEY (programID) REFERENCES programs(programID) ON DELETE SET NULL,
  FOREIGN KEY (userID)    REFERENCES users(userID)
) ENGINE=InnoDB;

-- ============================================================
-- DOCUMENT_PAGES (page-level scans for multi-page documents)
-- ============================================================
CREATE TABLE IF NOT EXISTS document_pages (
  pageID      VARCHAR(15)   NOT NULL PRIMARY KEY,
  itemID      VARCHAR(15)   NOT NULL,
  userID      VARCHAR(9)    NOT NULL,
  assetID     VARCHAR(15)   DEFAULT NULL,
  pageNumber  INT           NOT NULL,
  filePath    TEXT          NOT NULL,
  fileSize    DECIMAL(10,2) DEFAULT NULL,
  FOREIGN KEY (itemID)   REFERENCES items(itemID),
  FOREIGN KEY (userID)   REFERENCES users(userID),
  FOREIGN KEY (assetID)  REFERENCES digital_assets(assetID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- INTEGRITY_HISTORY (health monitoring records)
-- ============================================================
CREATE TABLE IF NOT EXISTS integrity_history (
  checkID       VARCHAR(15)   NOT NULL PRIMARY KEY,
  assetID       VARCHAR(15)   DEFAULT NULL,
  checksumValue VARCHAR(255)  NOT NULL,
  healthStatus  VARCHAR(20)   DEFAULT 'Healthy',
  verifiedDate  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  pageID        VARCHAR(15)   DEFAULT NULL,
  FOREIGN KEY (assetID) REFERENCES digital_assets(assetID) ON DELETE CASCADE,
  FOREIGN KEY (pageID)  REFERENCES document_pages(pageID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- ACTIVITY_LOGS (audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  logID      VARCHAR(15) NOT NULL PRIMARY KEY,
  userID     VARCHAR(9)  NOT NULL,
  assetID    VARCHAR(15) DEFAULT NULL,
  actionType VARCHAR(50) NOT NULL,
  timestamp  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  notes      TEXT        DEFAULT NULL,
  pageID     VARCHAR(15) DEFAULT NULL,
  FOREIGN KEY (userID)  REFERENCES users(userID),
  FOREIGN KEY (assetID) REFERENCES digital_assets(assetID) ON DELETE SET NULL,
  FOREIGN KEY (pageID)  REFERENCES document_pages(pageID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- SUBMISSIONS (curator approval workflow)
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  submissionID VARCHAR(15)  NOT NULL PRIMARY KEY,
  itemID       VARCHAR(15)  DEFAULT NULL,
  submittedBy  VARCHAR(9)   NOT NULL,
  reviewedBy   VARCHAR(9)   DEFAULT NULL,
  status       ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  notes        TEXT         DEFAULT NULL,
  createdAt    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updatedAt    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (itemID)      REFERENCES items(itemID) ON DELETE SET NULL,
  FOREIGN KEY (submittedBy) REFERENCES users(userID),
  FOREIGN KEY (reviewedBy)  REFERENCES users(userID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  notifID    INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userID     VARCHAR(9)   NOT NULL,
  title      VARCHAR(255) NOT NULL,
  message    TEXT         DEFAULT NULL,
  is_read    TINYINT(1)   DEFAULT 0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_items_type       ON items(typeName);
CREATE INDEX idx_items_collection ON items(collectionID);
CREATE INDEX idx_programs_status  ON programs(status);
CREATE INDEX idx_assets_item      ON digital_assets(itemID);
CREATE INDEX idx_assets_program   ON digital_assets(programID);
CREATE INDEX idx_logs_user        ON activity_logs(userID);
CREATE INDEX idx_logs_timestamp   ON activity_logs(timestamp);
CREATE INDEX idx_integrity_asset  ON integrity_history(assetID);
CREATE INDEX idx_pages_item       ON document_pages(itemID);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_notifs_user      ON notifications(userID);
