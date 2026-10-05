#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date +%T)] Starting production server..."
  node .next/standalone/server.js &
  SRV_PID=$!
  echo "[$(date +%T)] Server PID: $SRV_PID"
  
  # Health check: test port every 3s, kill if not listening
  while kill -0 $SRV_PID 2>/dev/null; do
    sleep 3
    # Check if port 3000 is actually accepting connections
    if ! curl -s --max-time 3 http://127.0.0.1:3000/ -o /dev/null 2>/dev/null; then
      echo "[$(date +%T)] Port check failed — killing PID $SRV_PID..."
      kill -9 $SRV_PID 2>/dev/null
      wait $SRV_PID 2>/dev/null
      break
    fi
  done
  echo "[$(date +%T)] Server exited, restarting in 2s..."
  sleep 2
done
