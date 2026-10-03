#!/bin/bash
# Build bison, flex, then PostgreSQL 18 from source. No apt.
set -e
cd /home/z/my-project/db-work
LOG=/home/z/my-project/db-work/build.log
echo "=== Build started $(date) ===" > "$LOG"

# ---------- 1. Build bison ----------
echo "[$(date +%T)] Building bison 3.8.2..." >> "$LOG"
tar xzf bison-3.8.2.tar.gz
cd bison-3.8.2
./configure --prefix=/home/z/local >> "$LOG" 2>&1
make -j2 >> "$LOG" 2>&1
make install >> "$LOG" 2>&1
cd ..
echo "[$(date +%T)] bison installed: $(/home/z/local/bin/bison --version | head -1)" >> "$LOG"

# ---------- 2. Build flex ----------
echo "[$(date +%T)] Building flex 2.6.4..." >> "$LOG"
tar xzf flex-2.6.4.tar.gz
cd flex-2.6.4
./configure --prefix=/home/z/local >> "$LOG" 2>&1
make -j2 >> "$LOG" 2>&1
make install >> "$LOG" 2>&1
cd ..
echo "[$(date +%T)] flex installed: $(/home/z/local/bin/flex --version)" >> "$LOG"

# ---------- 3. Build PostgreSQL 18 ----------
export PATH="/home/z/local/bin:$PATH"
echo "[$(date +%T)] Configuring PostgreSQL 18.0..." >> "$LOG"
cd postgresql-18.0
./configure --prefix=/home/z/pg18 --without-readline --without-icu --with-openssl >> "$LOG" 2>&1
echo "[$(date +%T)] Building PostgreSQL (make world -j2, ~10 min)..." >> "$LOG"
make -j2 >> "$LOG" 2>&1
make install >> "$LOG" 2>&1
cd ..
echo "[$(date +%T)] postgres installed: $(/home/z/pg18/bin/postgres --version)" >> "$LOG"

# ---------- 4. initdb ----------
export PATH="/home/z/pg18/bin:$PATH"
echo "[$(date +%T)] initdb..." >> "$LOG"
mkdir -p /home/z/pg18-data
initdb -D /home/z/pg18-data -U accsium --auth-local=trust --auth-host=trust >> "$LOG" 2>&1

# Configure: listen on localhost, port 5432
cat >> /home/z/pg18-data/postgresql.conf <<EOF

# Cryptsk custom config
listen_addresses = 'localhost'
port = 5432
max_connections = 50
shared_buffers = 128MB
EOF

# ---------- 5. start server ----------
echo "[$(date +%T)] Starting server..." >> "$LOG"
pg_ctl -D /home/z/pg18-data -l /home/z/pg18-data/server.log -w start >> "$LOG" 2>&1
sleep 2

# ---------- 6. create roles ----------
echo "[$(date +%T)] Creating roles..." >> "$LOG"
psql -U accsium -d postgres -c "CREATE ROLE cryptsk WITH LOGIN SUPERUSER PASSWORD 'cryptsk';" >> "$LOG" 2>&1 || true
psql -U accsium -d postgres -c "CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';" >> "$LOG" 2>&1 || true
psql -U accsium -d postgres -c "ALTER ROLE accsium WITH SUPERUSER PASSWORD 'accsium';" >> "$LOG" 2>&1 || true
psql -U accsium -d postgres -c "CREATE DATABASE accsium OWNER accsium;" >> "$LOG" 2>&1 || true

echo "[$(date +%T)] === BUILD + SERVER READY ===" >> "$LOG"
psql -U accsium -d postgres -c "\du" >> "$LOG" 2>&1
psql -U accsium -d postgres -c "\l" >> "$LOG" 2>&1
echo "=== Done $(date) ===" >> "$LOG"
