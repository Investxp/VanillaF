# PowerShell script to build, commit, push, and deploy
# Run this from the monorepo root (VANILLA F)

# Build client
cd client
npm run build
cd ..

# Build server (if needed)
cd server
npm run build
cd ..

# Add all changes
 git add .

# Commit with timestamp
$commitMsg = "auto: build, commit, push $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m "$commitMsg"

# Push to remote
 git push

Write-Host "Build, commit, and push complete. Railway will auto-deploy if connected."
