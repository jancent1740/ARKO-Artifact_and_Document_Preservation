USE arko_db;

-- ============================================================
-- SEED: Roles
-- ============================================================
INSERT INTO roles (roleID, roleName) VALUES
('ROLE-001', 'curator'),
('ROLE-002', 'staff'),
('ROLE-003', 'volunteer');

-- ============================================================
-- SEED: Users  (password stored as plain text per schema; bcrypt used in auth layer)
-- ============================================================
INSERT INTO users (userID, roleID, username, email, firstName, middleName, lastName, activeStatus, password) VALUES
('USR-00001', 'ROLE-001', 'elizabeth.anderson', 'elizabeth@example.com', 'Elizabeth', NULL,    'Anderson', TRUE, 'password123'),
('USR-00002', 'ROLE-002', 'jennifer.williams',  'jennifer@example.com',  'Jennifer',  NULL,    'Williams',  TRUE, 'password123'),
('USR-00003', 'ROLE-002', 'sarah.johnson',      'sarah@example.com',     'Sarah',     NULL,    'Johnson',   TRUE, 'password123'),
('USR-00004', 'ROLE-002', 'maria.rodriguez',    'maria@example.com',     'Maria',     NULL,    'Rodriguez', TRUE, 'password123'),
('USR-00005', 'ROLE-002', 'michael.chen',       'michael@example.com',   'Michael',   NULL,    'Chen',      TRUE, 'password123');

-- ============================================================
-- SEED: Collections
-- ============================================================
INSERT INTO collections (collectionID, establishedDate, userID, collectionName, type, description, status) VALUES
('COL-00001', '2020-01-15 00:00:00', 'USR-00001', 'Historical Maps',      'document', 'Colonial and early 20th century maps of the Bicol region', 'Active'),
('COL-00002', '2020-03-10 00:00:00', 'USR-00001', '19th Century Letters', 'document', 'Personal and official correspondence from the 1800s',       'Active'),
('COL-00003', '2019-06-01 00:00:00', 'USR-00001', 'Colonial Documents',   'document', 'Spanish colonial-era administrative records',               'Active'),
('COL-00004', '2021-02-20 00:00:00', 'USR-00001', 'Military Portraits',   'artifact', 'Portraits of military figures from various periods',         'Active'),
('COL-00005', '2018-09-05 00:00:00', 'USR-00001', 'Archaeological Finds', 'artifact', 'Artifacts recovered from local archaeological sites',        'Active');

-- ============================================================
-- SEED: Items
-- ============================================================
INSERT INTO items (itemID, collectionID, itemName, acquisitionDate, description, provenance, height, width, length, texture, color, remarks, documentType, artifactType, authorFirstName, authorLastName, typeName) VALUES
('ITM-00001', 'COL-00002', 'Letter from A. Santos (1895)',   '1895-06-15 00:00:00', 'Personal letter discussing trade routes',              'Donated by Santos family',  28.00, 21.00, NULL, 'Smooth', 'Yellowed', 'Some yellowing on edges',  'Letter',     NULL,       'A.',    'Santos',    'document'),
('ITM-00002', 'COL-00001', 'Colonial Map Fragment',          '1892-01-01 00:00:00', 'Fragment of a Spanish colonial map',                   'Found in church archives',  60.00, 45.00, NULL, 'Rough',  'Beige',    'Edge damage noted',        'Map',        NULL,       NULL,    NULL,        'document'),
('ITM-00003', 'COL-00004', 'Portrait of General Rivera',     '2025-01-10 00:00:00', 'Oil painting of General Rivera',                       'Museum acquisition 2025',   90.00, 60.00, NULL, 'Smooth', 'Multicolor','Good condition',           NULL,         'Painting', 'F.',    'Guerrero',  'artifact'),
('ITM-00004', 'COL-00005', 'Ceramic Bowl Fragment',          '2025-02-05 00:00:00', 'Pre-colonial ceramic bowl fragment',                   'Archaeological dig 2024',   15.00, 15.00, NULL, 'Rough',  'Brown',    'Repaired crack visible',   NULL,         'Pottery',  NULL,    NULL,        'artifact'),
('ITM-00005', 'COL-00003', 'Manuscript Page 45',             '1888-03-20 00:00:00', 'Religious manuscript from 1888',                       'Seminario Conciliar',       35.00, 25.00, NULL, 'Smooth', 'Cream',    'Ink fading on margins',    'Manuscript', NULL,       'Fray L.', 'de Vera', 'document'),
('ITM-00006', 'COL-00004', 'Religious Icon Panel',           '2025-01-20 00:00:00', 'Wooden panel with religious iconography',              'Church donation',           55.00, 40.00, NULL, 'Rough',  'Gold',     'Flaking paint on corners', NULL,         'Painting', NULL,    NULL,        'artifact'),
('ITM-00007', 'COL-00002', 'Trade Agreement Document',       '1890-07-12 00:00:00', 'Document detailing trade agreements',                  'Government archives',       40.00, 30.00, NULL, 'Smooth', 'White',    NULL,                       'Report',     NULL,       'G.',    'del Rosario','document'),
('ITM-00008', 'COL-00001', 'Cathedral Interior Photo',       '2025-03-01 00:00:00', 'Historical photograph of cathedral interior',          'Unknown photographer',      25.00, 20.00, NULL, 'Smooth', 'Sepia',    NULL,                       'Other',      NULL,       NULL,    NULL,        'document'),
('ITM-00009', 'COL-00005', 'Stone Tool Fragment',            '2025-02-18 00:00:00', 'Pre-colonial stone tool fragment',                     'Archaeological dig 2024',    4.00,  8.00, NULL, 'Rough',  'Gray',     NULL,                       NULL,         'Tool',     NULL,    NULL,        'artifact'),
('ITM-00010', 'COL-00002', 'Personal Correspondence Letter', '1893-11-05 00:00:00', 'Personal letter concerning family matters',            'Donated by Reyes family',   27.00, 21.00, NULL, 'Smooth', 'Yellowed', 'Slight tearing on fold',   'Letter',     NULL,       'M.',    'Reyes',     'document');

-- ============================================================
-- SEED: Programs
-- ============================================================
INSERT INTO programs (programID, userID, projectName, description, startDate, endDate, status, planType) VALUES
('PRG-00001', 'USR-00001', 'Colonial Archives Preservation',   'Digitization of colonial-era documents and maps',              '2025-01-15', '2025-12-20', 'Active', 'collection-based'),
('PRG-00002', 'USR-00001', '19th Century Letters',             'Digitization and cataloging of 19th century correspondence',   '2025-02-01', NULL,         'Active', 'collection-based'),
('PRG-00003', 'USR-00001', 'Portraits Collection 2025',        'High-resolution digitization of portrait paintings',           '2025-03-01', '2025-09-30', 'Active', 'manual'),
('PRG-00004', 'USR-00001', 'Urgent Document Scan',             'Priority digitization of fragile documents',                   '2025-05-01', '2025-07-30', 'Active', 'manual'),
('PRG-00005', 'USR-00001', 'Research Materials Digitization',  'Digitization of materials for academic research',              '2025-06-01', NULL,         'Active', 'collection-based');

-- ============================================================
-- SEED: Program Assignments
-- ============================================================
INSERT INTO program_assignments (assignmentID, programID, userID) VALUES
('ASN-00001', 'PRG-00001', 'USR-00002'),
('ASN-00002', 'PRG-00001', 'USR-00003'),
('ASN-00003', 'PRG-00002', 'USR-00003'),
('ASN-00004', 'PRG-00002', 'USR-00004'),
('ASN-00005', 'PRG-00003', 'USR-00002'),
('ASN-00006', 'PRG-00003', 'USR-00005'),
('ASN-00007', 'PRG-00004', 'USR-00002'),
('ASN-00008', 'PRG-00004', 'USR-00003'),
('ASN-00009', 'PRG-00004', 'USR-00004'),
('ASN-00010', 'PRG-00005', 'USR-00005');

-- ============================================================
-- SEED: Program Items
-- ============================================================
INSERT INTO program_items (programItemID, programID, itemID) VALUES
('PI-000001', 'PRG-00001', 'ITM-00002'),
('PI-000002', 'PRG-00001', 'ITM-00005'),
('PI-000003', 'PRG-00001', 'ITM-00008'),
('PI-000004', 'PRG-00002', 'ITM-00001'),
('PI-000005', 'PRG-00002', 'ITM-00007'),
('PI-000006', 'PRG-00002', 'ITM-00010'),
('PI-000007', 'PRG-00003', 'ITM-00003'),
('PI-000008', 'PRG-00003', 'ITM-00006'),
('PI-000009', 'PRG-00004', 'ITM-00004'),
('PI-000010', 'PRG-00004', 'ITM-00009');

-- ============================================================
-- SEED: Digital Assets
-- ============================================================
INSERT INTO digital_assets (assetID, itemID, programID, userID, fileName, fileSize, filePath, resolution, numFiles, fileFormat) VALUES
('AST-00001', 'ITM-00002', 'PRG-00001', 'USR-00002', 'colonial_map_fragment.tiff',    50.00, '/uploads/colonial_map_fragment.tiff',    '600dpi', 1, 'tiff'),
('AST-00002', 'ITM-00001', 'PRG-00002', 'USR-00003', 'santos_letter_1895.tiff',        2.00, '/uploads/santos_letter_1895.tiff',        '300dpi', 1, 'tiff'),
('AST-00003', 'ITM-00003', 'PRG-00003', 'USR-00002', 'general_rivera_portrait.tiff', 150.00, '/uploads/general_rivera_portrait.tiff',  '1200dpi', 1, 'tiff');

-- ============================================================
-- SEED: Integrity History
-- ============================================================
INSERT INTO integrity_history (checkID, assetID, checksumValue, healthStatus, pageID) VALUES
('CHK-00001', 'AST-00001', 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', 'Healthy', NULL),
('CHK-00002', 'AST-00002', 'b2c3d4e5f6a7b2c3d4e5f6a7b2c3d4e5f6a7b2c3d4e5f6a7b2c3d4e5f6a7b2c3', 'Healthy', NULL),
('CHK-00003', 'AST-00003', 'c3d4e5f6a7b8c3d4e5f6a7b8c3d4e5f6a7b8c3d4e5f6a7b8c3d4e5f6a7b8c3d4', 'Healthy', NULL);

-- ============================================================
-- SEED: Activity Logs
-- ============================================================
INSERT INTO activity_logs (logID, userID, assetID, actionType, notes, pageID) VALUES
('LOG-00001', 'USR-00001', NULL,       'Created Program',     'Created Colonial Archives Preservation program', NULL),
('LOG-00002', 'USR-00002', 'AST-00001','Uploaded Asset',      'Uploaded colonial_map_fragment.tiff',            NULL),
('LOG-00003', 'USR-00003', 'AST-00002','Uploaded Asset',      'Uploaded santos_letter_1895.tiff',               NULL),
('LOG-00004', 'USR-00002', 'AST-00003','Uploaded Asset',      'Uploaded general_rivera_portrait.tiff',          NULL),
('LOG-00005', 'USR-00001', NULL,       'Approved Submission', 'Approved item ITM-00001',                        NULL),
('LOG-00006', 'USR-00004', NULL,       'Created Draft',       'Created draft for Ceramic Bowl Fragment',        NULL),
('LOG-00007', 'USR-00005', NULL,       'Completed Task',      'Completed digitization of Trade Agreement Document', NULL);
