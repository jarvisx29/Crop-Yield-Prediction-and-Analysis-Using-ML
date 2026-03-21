#!/bin/bash
# start.sh — Launch the Crop Yield Prediction app (backend + frontend)
# Usage: bash start.sh

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
VENV="$DIR/venv/bin/activate"
LOG="$DIR/backend.log"

echo ""
echo "======================================"
echo "  Crop Yield Prediction System"
echo "======================================"

# ── Check model is trained ─────────────────────────────────────────────
if [ ! -f "$DIR/model/model.pkl" ]; then
  echo "[1/2] Training model (first run only)..."
  source "$VENV" && python "$DIR/train_model.py"
else
  echo "[1/2] Model already trained. Skipping."
fi

# ── Kill any leftover process on port 5001 ─────────────────────────────
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# ── Start Flask backend ────────────────────────────────────────────────
echo "[2/2] Starting backend on http://localhost:5001 ..."
source "$VENV" && python "$DIR/app.py" > "$LOG" 2>&1 &
FLASK_PID=$!

# Wait until server responds
for i in {1..10}; do
  if curl -s http://localhost:5001/ > /dev/null 2>&1; then
    break
  fi
  sleep 1
done

# ── Open frontend ──────────────────────────────────────────────────────
echo ""
echo "  Backend : http://localhost:5001"
echo "  Frontend: opening index.html in browser..."
echo "  Logs    : $LOG"
echo ""
echo "  Press Ctrl+C to stop the server."
echo "======================================"

open "$DIR/index.html"

# Keep script alive so Ctrl+C kills Flask
trap "kill $FLASK_PID 2>/dev/null; echo 'Server stopped.'" INT TERM
wait $FLASK_PID
