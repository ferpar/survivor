FROM postgres:13.1

# Copy the initialization script
COPY ./initDb.sh ./docker-entrypoint-initdb.d

# Open port 5432 for the postgresql server
EXPOSE 5432
