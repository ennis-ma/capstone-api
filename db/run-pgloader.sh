#!/bin/bash
set -e

# Start PostgreSQL service
service postgresql start

# Create a new PostgreSQL database
psql -U postgres -c "CREATE DATABASE gbt;"

# Load TimescaleDB extension into the new database
psql -U postgres -d gbt -c "CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"

# Use pgloader to migrate the SQLite database to PostgreSQL
pgloader platform-historian.sqlite postgresql://postgres@/gbt

# Run the SQL script to create hypertable
psql -U postgres -d gbt -f /docker-entrypoint-initdb.d/create_hypertable.sql

# Keep the container running
tail -f /dev/null