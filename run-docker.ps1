# ==============================================================================
# PTAI v3 - Docker Launcher with Git Pull
# Pulls current version of code and launches the Docker environment.
# ==============================================================================

$RepoDir = $PSScriptRoot
if (-not (Test-Path "$RepoDir\docker-compose.yml") -and (Test-Path "$RepoDir\PTAIV3_final\docker-compose.yml")) {
    $RepoDir = "$RepoDir\PTAIV3_final"
}
Set-Location $RepoDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Launching PTAI v3 Docker Environment" -ForegroundColor Cyan
Write-Host "📂 Working Directory: $RepoDir" -ForegroundColor Cyan
Write-Host "⬇️  Pulling current code version from Git..." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Check for local uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Local changes detected prior to pull. Auto-committing..." -ForegroundColor Gray
    git add .
    git commit -m "Auto-commit before docker run: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# Pull latest code
try {
    git pull origin master --no-edit
    Write-Host "✅ Code is up to date." -ForegroundColor Green
} catch {
    Write-Warning "⚠️ Could not pull from Git (offline or conflict). Continuing with local version."
}

# Start containers
Write-Host "`n🐳 Starting Docker containers..." -ForegroundColor Cyan
docker compose up -d

Write-Host "`n📋 Running containers:" -ForegroundColor Cyan
docker compose ps
