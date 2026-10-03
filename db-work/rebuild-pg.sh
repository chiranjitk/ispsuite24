#!/bin/bash
set -e
cd /home/z/my-project/db-work
export PATH="/home/z/local/bin:$PATH"
echo "[$(date +%T)] Configuring PG..." > pg-rebuild.log
cd postgresql-18.0
./configure --prefix=/home/z/pg18 --without-readline --without-icu --with-openssl >> /home/z/my-project/db-work/pg-rebuild.log 2>&1
echo "[$(date +%T)] Building PG..." >> /home/z/my-project/db-work/pg-rebuild.log
make -j1 >> /home/z/my-project/db-work/pg-rebuild.log 2>&1
make install >> /home/z/my-project/db-work/pg-rebuild.log 2>&1
echo "[$(date +%T)] initdb..." >> /home/z/my-project/db-work/pg-rebuild.log
export PATH="/home/z/pg18/bin:$PATH"
mkdir -p /home/z/pg18-data
initdb -D /home/z/pg18-data -U accsium --auth-local=trust --auth-host=trust >> /home/z/my-project/db-work/pg-rebuild.log 2>&1
echo "listen_addresses = 'localhost'" >> /home/z/pg18-data/postgresql.conf
echo "port = 5432" >> /home/z/pg18-data/postgresql.conf
echo "max_connections = 50" >> /home/z/pg18-data/postgresql.conf
echo "shared_buffers = 128MB" >> /home/z/pg18-data/postgresql.conf
echo "[$(date +%T)] Starting server..." >> /home/z/my-project/db-work/pg-rebuild.log
pg_ctl -D /home/z/pg18-data -l /home/z/pg18-data/server.log -w start >> /home/z/my-project/db-work/pg-rebuild.log 2>&1
sleep 2
psql -U accsium -d postgres -c "CREATE ROLE cryptsk WITH LOGIN SUPERUSER PASSWORD 'cryptsk';" >> /home/z/my-project/db-work/pg-rebuild.log 2>&1 || true
psql -U accsium -d postgres -c "CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';" >> /home/z/my-project/db-work/pg-rebuild.log 2>&1 || true
psql -U accsium -d postgres -c "ALTER ROLE accsium WITH SUPERUSER PASSWORD 'accsium';" >> /home/z/my-project/db-work/pg-rebuild.log 2>&1 || true
psql -U accsium -d postgres -c "CREATE DATABASE accsium OWNER accsium;" >> /home/z/my-project/db-work/pg-rebuild.log 2>&1 || true
echo "[$(date +%T)] Restoring dump..." >> /home/z/my-project/db-work/pg-rebuild.log
psql -U accsium -d accsium -f /home/z/my-project/db-work/accsium_rev05 >> /home/z/my-project/db-work/pg-rebuild.log 2>&1
echo "[$(date +%T)] DONE" >> /home/z/my-project/db-work/pg-rebuild.log
echo "DONE" > /home/z/my-project/db-work/pg-rebuild-status.txt
