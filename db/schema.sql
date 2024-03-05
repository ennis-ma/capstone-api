CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE data (
  ts timestamp NOT NULL,
  topic_id INTEGER NOT NULL,
  value_string DOUBLE PRECISION NOT NULL,
  UNIQUE(topic_id, ts)
);

SELECT create_hypertable('data', 'ts', if_not_exists => TRUE, migrate_data => TRUE);

CREATE INDEX data_idx ON data (ts ASC);

CREATE TABLE topics (
  topic_id INTEGER PRIMARY KEY,
  topic_name TEXT NOT NULL,
  metadata TEXT,
  UNIQUE(topic_name)
);