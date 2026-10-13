#!/bin/sh

# ==============================================================================
# PTAI v3 - Docker Git Auto-Sync
# Pulls current code version on startup and continuously synchronizes with Git.
# ==============================================================================

# 1. Mark directory as safe for Git (handles permission/ownership in Docker)
git config --global --add safe.directory /app
cd /app || exit 1

# 2. Configure Git identity for auto-commits
git config --global user.email "${GIT_COMMIT_EMAIL:-auto-sync@docker.local}"
git config --global user.name "${GIT_COMMIT_NAME:-Docker Auto Sync}"

# 3. Determine active branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="${GIT_BRANCH:-master}"
fi

REMOTE_NAME="origin"
REMOTE_URL="${GIT_REMOTE_URL:-https://github.com/Athish2211/PTAIV3.git}"

# 4. Configure authenticated remote URL if GITHUB_TOKEN is supplied
if [ -n "$GITHUB_TOKEN" ]; then
    CLEAN_URL=$(echo "$REMOTE_URL" | sed -e 's|https://||' -e 's|http://||')
    AUTH_REMOTE_URL="https://${GITHUB_TOKEN}@${CLEAN_URL}"
    git remote set-url "$REMOTE_NAME" "$AUTH_REMOTE_URL" 2>/dev/null || git remote add "$REMOTE_NAME" "$AUTH_REMOTE_URL" 2>/dev/null
    echo "🔑 GitHub Token detected: Authenticated sync enabled."
else
    git remote set-url "$REMOTE_NAME" "$REMOTE_URL" 2>/dev/null || git remote add "$REMOTE_NAME" "$REMOTE_URL" 2>/dev/null
fi

echo "=================================================================="
echo "🚀 PTAI Auto-Sync starting up at $(date)"
echo "📌 Branch: $CURRENT_BRANCH | Remote: $REMOTE_NAME"
echo "⬇️  Pulling current code version from Git..."
echo "=================================================================="

# Function to safely pull code
do_pull() {
    # Check if there are uncommitted local changes before pulling
    if [ -n "$(git status --porcelain)" ]; then
        echo "📝 Local changes detected prior to pull. Auto-committing locally..."
        git add .
        git commit -m "Auto-commit before sync: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null
    fi

    # Attempt rebase pull first to keep history linear, fallback to standard merge pull
    if git pull --rebase "$REMOTE_NAME" "$CURRENT_BRANCH"; then
        echo "✅ Code is up-to-date with $REMOTE_NAME/$CURRENT_BRANCH."
        return 0
    else
        echo "⚠️  Rebase pull encountered conflicts or issues. Aborting rebase and attempting merge pull..."
        git rebase --abort 2>/dev/null
        if git pull --no-edit "$REMOTE_NAME" "$CURRENT_BRANCH"; then
            echo "✅ Code updated via merge pull."
            return 0
        else
            echo "⚠️  Could not pull latest changes (offline or conflict). Continuing with local version."
            git merge --abort 2>/dev/null
            return 1
        fi
    fi
}

# Function to safely push code
do_push() {
    if git push "$REMOTE_NAME" "$CURRENT_BRANCH" 2>/dev/null; then
        echo "🚀 Changes successfully pushed to $REMOTE_NAME/$CURRENT_BRANCH."
        return 0
    else
        echo "⚠️  Push note: Local commits saved. To push to GitHub from inside Docker,"
        echo "   provide GITHUB_TOKEN in .env (or run auto-sync.ps1 on Windows host)."
        return 1
    fi
}

# 5. Startup Pull (Runs immediately when Docker container starts)
do_pull

# Signal healthcheck that initial startup pull is complete
touch /tmp/initial_sync_done

# 6. Continuous Synchronization Loop
INTERVAL="${SYNC_INTERVAL:-15}"
echo "🔄 Continuous sync active (checking every ${INTERVAL}s)..."

while true; do
    sleep "$INTERVAL"

    # Step A: Check for remote updates
    git fetch "$REMOTE_NAME" "$CURRENT_BRANCH" 2>/dev/null
    BEHIND_COUNT=$(git rev-list "HEAD..$REMOTE_NAME/$CURRENT_BRANCH" --count 2>/dev/null || echo "0")

    if [ "$BEHIND_COUNT" -gt 0 ]; then
        echo "📥 Detected $BEHIND_COUNT new commit(s) on remote. Pulling latest code..."
        do_pull
    fi

    # Step B: Check for local file modifications
    if [ -n "$(git status --porcelain)" ]; then
        echo "💾 Local modifications detected at $(date). Auto-committing..."
        git add .
        git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
        do_push
    else
        # Step C: If commits were made previously but not yet pushed
        AHEAD_COUNT=$(git rev-list "$REMOTE_NAME/$CURRENT_BRANCH..HEAD" --count 2>/dev/null || echo "0")
        if [ "$AHEAD_COUNT" -gt 0 ] && [ -n "$GITHUB_TOKEN" ]; then
            do_push
        fi
    fi
done
