CREATE TABLE
    zipcode_data(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zipcode INTEGER UNIQUE,
        res_count INTEGER,
        country_code VARCHAR(60) NOT NULL,
        bus_count INTEGER,
        total_count INTEGER,
        zone_id VARCHAR(100),
        city VARCHAR(100),
        state VARCHAR(20),
        facility VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE process_status (
    last_zipcode VARCHAR(10) NOT NULL
);

-- INSERT INTO process_status (last_zipcode) VALUES ('79907');

SELECT last_zipcode FROM process_status;

-- DELETE FROM process_status;