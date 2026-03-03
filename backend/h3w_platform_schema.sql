BEGIN TRANSACTION;
CREATE TABLE data_source (
	id INTEGER NOT NULL, 
	name VARCHAR, 
	source_type VARCHAR, 
	file_path VARCHAR, 
	schema_info JSON, 
	health_score FLOAT, 
	quality_report JSON, 
	organization_id INTEGER NOT NULL, 
	created_by INTEGER NOT NULL, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME, settings JSON DEFAULT '{"missing_threshold": 10.0, "duplicate_threshold": 5.0, "sensitivity": "balanced"}', 
	PRIMARY KEY (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id), 
	FOREIGN KEY(created_by) REFERENCES user (id)
);
CREATE TABLE insight (
	id INTEGER NOT NULL, 
	title VARCHAR NOT NULL, 
	description VARCHAR NOT NULL, 
	impact_level VARCHAR, 
	confidence_score FLOAT, 
	evidence JSON, 
	ai_root_cause VARCHAR, 
	category VARCHAR, 
	status VARCHAR, 
	data_source_id INTEGER, 
	organization_id INTEGER NOT NULL, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, visualization_data JSON, 
	PRIMARY KEY (id), 
	FOREIGN KEY(data_source_id) REFERENCES data_source (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id)
);
CREATE TABLE organization (
	id INTEGER NOT NULL, 
	name VARCHAR NOT NULL, 
	slug VARCHAR NOT NULL, 
	is_active BOOLEAN, 
	settings JSON, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO "organization" VALUES(1,'','h3w-default',1,'{"verbosity": "Balanced", "conservative": true, "realtime": false, "notifications": true}','2026-02-15 14:54:51','2026-02-15 14:59:43');
CREATE TABLE user (
	id INTEGER NOT NULL, 
	full_name VARCHAR, 
	email VARCHAR NOT NULL, 
	hashed_password VARCHAR NOT NULL, 
	is_active BOOLEAN, 
	is_superuser BOOLEAN, 
	organization_id INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id)
);
INSERT INTO "user" VALUES(1,NULL,'admin@h3w.com','$pbkdf2-sha256$29000$L.U8Z.xdS0nJee/de0/pnQ$6GmpCKNUCfH9RXD68rxj4OiJGQw/Xp3FyGhdkmBPLJw',1,1,1,'2026-02-15 14:54:51',NULL);
CREATE INDEX ix_organization_name ON organization (name);
CREATE INDEX ix_organization_id ON organization (id);
CREATE UNIQUE INDEX ix_organization_slug ON organization (slug);
CREATE INDEX ix_user_full_name ON user (full_name);
CREATE INDEX ix_user_id ON user (id);
CREATE UNIQUE INDEX ix_user_email ON user (email);
CREATE INDEX ix_data_source_id ON data_source (id);
CREATE INDEX ix_data_source_name ON data_source (name);
CREATE INDEX ix_insight_id ON insight (id);
CREATE INDEX ix_insight_title ON insight (title);
COMMIT;
