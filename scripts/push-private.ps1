param([string]$RepositoryName = 'chainbounty-research')
$ErrorActionPreference = 'Stop'
if ($RepositoryName -notmatch '^[a-zA-Z0-9][a-zA-Z0-9._-]+$') { throw 'Invalid repository name.' }
Set-Location (Split-Path $PSScriptRoot -Parent)
$login = gh api user --jq .login
if ($LASTEXITCODE -ne 0 -or $login.Trim() -ne 'waynedwkim') { throw 'Authenticate GitHub CLI as waynedwkim before continuing.' }
$fullName = "waynedwkim/$RepositoryName"
# A successful lookup means the name is already in use; never overwrite it.
$ErrorActionPreference = 'Continue'
$lookup = gh api "repos/$fullName" 2>&1
$lookupCode = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
if ($lookupCode -eq 0) { throw "Repository already exists: $fullName. Select a new name." }
if (($lookup | Out-String) -notmatch '404') { throw 'Could not establish that the repository name is available.' }
$remotes = git remote
if ($LASTEXITCODE -ne 0) { throw 'Run this script from the committed local Git repository.' }
if ($remotes -contains 'origin') { throw 'An origin remote already exists; review it before proceeding.' }
gh repo create $fullName --private --description 'Interactive ChainBounty research publication' --source . --remote origin --push
if ($LASTEXITCODE -ne 0) { throw 'Creation/push did not complete. Inspect remote state before retrying.' }
$meta = gh repo view $fullName --json nameWithOwner,isPrivate,url | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or !$meta.isPrivate -or $meta.nameWithOwner -ne $fullName) { throw 'Private personal repository verification failed.' }
$localCommit = git rev-parse HEAD
$remoteCommit = gh api "repos/$fullName/commits/main" --jq .sha
if ($LASTEXITCODE -ne 0 -or $localCommit.Trim() -ne $remoteCommit.Trim()) { throw 'Remote commit verification failed.' }
Write-Output "Verified private repository: $($meta.url)"
Write-Output "Commit: $remoteCommit"
