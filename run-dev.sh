#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date +%T)] Starting webpack dev server..."
  ./node_modules/.bin/next dev -p 3000 --webpack 2>&1
  echo "[$(date +%T)] Server died (exit $?), restarting immediately..."
  sleep 1
done
