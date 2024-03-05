# Use Ubuntu 20.04 as base image
FROM ubuntu:20.04

# Install necessary packages
RUN apt-get update && apt-get install -y software-properties-common wget curl gnupg && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list && \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    apt-get update && apt-get install -y postgresql-12 && \
    echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/timescaledb.list && \
    curl -L https://packagecloud.io/timescale/timescaledb/gpgkey | apt-key add - && \
    apt-get update && apt-get install -y timescaledb-2-postgresql-12 pgloader && \
    echo "local all postgres trust" > /etc/postgresql/12/main/pg_hba.conf && \
    echo "host all postgres 127.0.0.1/32 trust" >> /etc/postgresql/12/main/pg_hba.conf && \
    echo "host all postgres ::1/128 trust" >> /etc/postgresql/12/main/pg_hba.conf && \
    echo "host all all 0.0.0.0/0 trust" >> /etc/postgresql/12/main/pg_hba.conf && \
    echo "shared_preload_libraries = 'timescaledb'" >> /etc/postgresql/12/main/postgresql.conf && \
    echo "listen_addresses = '*'" >> /etc/postgresql/12/main/postgresql.conf

# Copy necessary files
COPY run-pgloader.sh /run-pgloader.sh
COPY create_hypertable.sql /docker-entrypoint-initdb.d/create_hypertable.sql
COPY platform-historian.sqlite /platform-historian.sqlite

# Make the shell script executable
RUN chmod +x /run-pgloader.sh

# Expose PostgreSQL port
EXPOSE 5432

# Run the shell script
CMD ["/run-pgloader.sh"]