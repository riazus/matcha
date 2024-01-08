FROM mcr.microsoft.com/mssql/server:2022-latest

# Change active user to root
USER root 

RUN mkdir -p /usr/sql-sripts
WORKDIR /usr/sql-scripts

COPY . .

# Grant permissions for the import-data script to be executable
RUN chmod +x import-data.sh

# Switch back to mssql user and run the entrypoint script
USER mssql
ENTRYPOINT /bin/bash ./entrypoint.sh