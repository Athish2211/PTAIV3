# ==============================================================================
# PTAI v3 - Windows Host Git Auto-Sync
# Pulls current code version on startup and continuously synchronizes with Git.
# ==============================================================================

$RepoDir = $PSScriptRoot
if (-not (Test-Path "$RepoDir\.git") -and (Test-Path "$RepoDir\PTAIV3_final\.git")) {
    $RepoDir = "$RepoDir\PTAIV3_final"
}
Set-Location $RepoDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "[START] PTAI Auto-Sync (Host PowerShell)" -ForegroundColor Cyan
Write-Host "[INFO]  Working Directory: $RepoDir" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Ensure remote is origin
$remotes = git remote
if ($remotes -contains "master" -and -not ($remotes -contains "origin")) {
    git remote rename master origin 2>$null
}
if ($remotes -contains "origin/main") {
    git remote remove origin/main 2>$null
}

# 1. Startup Pull: Pull current version immediately
Write-Host "[SYNC]  Pulling current version of code from Git on startup..." -ForegroundColor Yellow
try {
    $status = git status --porcelain
    if ($status) {
        Write-Host "[INFO]  Local changes detected prior to pull. Auto-committing..." -ForegroundColor Gray
        git add .
        git commit -m "Auto-commit before startup pull: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    git pull --no-edit
    Write-Host "[OK]    Code is up-to-date with remote." -ForegroundColor Green
} catch {
    Write-Warning "[WARN]  Could not pull from Git (offline or conflict): $_"
}

# 2. Continuous synchronization loop
$IntervalSeconds = 15
Write-Host "[INFO]  Continuous sync active (checking every $IntervalSeconds seconds)..." -ForegroundColor Cyan

while ($true) {
    Start-Sleep -Seconds $IntervalSeconds
    try {
        # Check remote updates
        git fetch origin 2>$null
        $branch = git branch --show-current
        if (-not $branch) { $branch = "master" }

        $behind = (git rev-list "HEAD..origin/$branch" --count 2>$null)
        if ($behind) { $behind = $behind.Trim() }
        if ($behind -and [int]$behind -gt 0) {
            Write-Host "[SYNC]  Detected $behind new commit(s) on remote. Pulling latest code..." -ForegroundColor Yellow
            $status = git status --porcelain
            if ($status) {
                git add .
                git commit -m "Auto-commit before pull: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            }
            git pull --no-edit
            Write-Host "[OK]    Pulled remote changes." -ForegroundColor Green
        }

        # Check local changes
        $status = git status --porcelain
        if ($status) {
            Write-Host "[SYNC]  Local changes detected at $(Get-Date), syncing to Git..." -ForegroundColor Yellow
            git add .
            git commit -m "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            git push origin $branch
            Write-Host "[OK]    Sync complete (pushed to Git)." -ForegroundColor Green
        } else {
            # Check if local commits are ahead of remote
            $ahead = (git rev-list "origin/$branch..HEAD" --count 2>$null)
            if ($ahead) { $ahead = $ahead.Trim() }
            if ($ahead -and [int]$ahead -gt 0) {
                git push origin $branch
                Write-Host "[OK]    Pushed unpushed commits to Git." -ForegroundColor Green
            }
        }
    } catch {
        Write-Warning "[WARN]  Sync error: $_"
    }
}
