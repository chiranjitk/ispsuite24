#!/bin/bash
export PATH="/home/z/pg18/bin:$PATH"
pg_ctl -D /home/z/pg18-data -l /home/z/pg18-data/server.log -w start
echo "PostgreSQL started on localhost:5432"
echo "  Database: accsium"
echo "  User: accsium (password: accsium)"
echo "  Also: cryptsk (password: cryptsk), postgres (password: postgres)"
