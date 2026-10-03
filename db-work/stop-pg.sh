#!/bin/bash
export PATH="/home/z/pg18/bin:$PATH"
pg_ctl -D /home/z/pg18-data -m fast stop
echo "PostgreSQL stopped"
