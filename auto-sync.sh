#!/bin/sh

# Mark the mounted directory as safe for Git to prevent permission errors
git config --global --add safe.directory /app
# Set default git identity so it can commit properly if not inherited
git config --global user.email "auto-sync@docker.local"
git config --global user.name "Docker Auto Sync"

while true; do
    if [ -n "$(git status --porcelain)" ]; then
        echo "Changes detected at $(date), syncing to Git..."
        git add .
        git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
        git push || echo "Note: Push failed (no remote configured or no auth)."
        echo "Sync complete."
    fi
    sleep 15
done
