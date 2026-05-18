<#
.SYNOPSIS
    Automated deployment script for Sunave to Google Cloud.

.DESCRIPTION
    This script installs the Google Cloud SDK (if missing), authenticates the user,
    creates a new GCP project, enables necessary APIs, and deploys the Sunave app
    to Google Cloud Run.
#>

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Sunave Automated Deployment to GCP     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check/Install Google Cloud SDK
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "Google Cloud SDK not found. Installing..." -ForegroundColor Yellow
    
    $installDir = "$env:LOCALAPPDATA\Google\Cloud SDK"
    if (!(Test-Path $installDir)) {
        New-Item -Path $installDir -ItemType Directory -Force | Out-Null
    }
    
    $installerPath = "$env:TEMP\GoogleCloudSDKInstaller.exe"
    Write-Host "Downloading installer..."
    Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe" -OutFile $installerPath
    
    Write-Host "Running installer (please follow prompts)..."
    Start-Process -FilePath $installerPath -ArgumentList "/S", "/noreporting" -Wait
    
    # Add to path for this session
    $env:Path += ";$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin"
    
    Write-Host "Google Cloud SDK installed successfully." -ForegroundColor Green
} else {
    Write-Host "Google Cloud SDK is already installed." -ForegroundColor Green
}

# 2. Authenticate
Write-Host "`nAuthenticating with Google Cloud..." -ForegroundColor Yellow
Write-Host "A browser window will open. Please log in with your Google account."
gcloud auth login

# 3. Project Setup
Write-Host "`nLet's set up your Google Cloud Project." -ForegroundColor Yellow
$projectName = Read-Host "Enter a globally unique project ID (e.g., sunave-prod-12345)"

Write-Host "Creating project $projectName..."
gcloud projects create $projectName

Write-Host "Setting active project to $projectName..."
gcloud config set project $projectName

# 4. Billing Setup
Write-Host "`nChecking billing accounts..." -ForegroundColor Yellow
$billingAccounts = gcloud beta billing accounts list --format="value(name,displayName)"
Write-Host $billingAccounts

$billingId = Read-Host "Enter the Billing Account ID from the list above to link to this project"
Write-Host "Linking billing account..."
gcloud beta billing projects link $projectName --billing-account $billingId

# 5. Enable APIs
Write-Host "`nEnabling required APIs (this may take a few minutes)..." -ForegroundColor Yellow
$apis = @(
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "speech.googleapis.com",
    "generativelanguage.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "Enabling $api..."
    gcloud services enable $api
}

# 6. Set up Secrets (Placeholders for user to fill in console)
Write-Host "`nCreating Secret Manager placeholders..." -ForegroundColor Yellow
Write-Host "NOTE: You MUST go to the GCP Console to add new versions with the actual secret values." -ForegroundColor Red

gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
gcloud secrets create GOOGLE_APPLICATION_CREDENTIALS --replication-policy="automatic"

# Grant Cloud Build service account access to secrets
$projectNumber = gcloud projects describe $projectName --format="value(projectNumber)"
$serviceAccount = "$projectNumber@cloudbuild.gserviceaccount.com"

gcloud secrets add-iam-policy-binding GEMINI_API_KEY `
    --member="serviceAccount:$serviceAccount" `
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding GOOGLE_APPLICATION_CREDENTIALS `
    --member="serviceAccount:$serviceAccount" `
    --role="roles/secretmanager.secretAccessor"

# 7. Deployment
Write-Host "`nDeploying to Cloud Run..." -ForegroundColor Yellow
Write-Host "Building and deploying via cloudbuild.yaml..."

# Replace project ID in cloudbuild.yaml temporarily if needed, or rely on gcloud default
gcloud builds submit --config cloudbuild.yaml .

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " Deployment process complete!           " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:"
Write-Host "1. Go to Google Cloud Console > Secret Manager and add your actual API keys."
Write-Host "2. Go to Firebase Console, add a new project, and link it to $projectName."
Write-Host "3. Enable Firebase Authentication (Google Sign-In) and Firestore database."
Write-Host "4. Redeploy or restart the Cloud Run service."
