$ErrorActionPreference = "Stop"

$Target = "C:\Users\hp\vi2"
$Patch = Join-Path $PSScriptRoot "_patch"

Write-Host ""
Write-Host "VI2 Sarah all-in-one repair" -ForegroundColor Cyan
Write-Host "Target: $Target"
Write-Host ""

if (-not (Test-Path $Target)) {
    throw "VI2 project was not found at $Target"
}

if (-not (Test-Path $Patch)) {
    throw "_patch folder is missing. Extract the ZIP completely before running this script."
}

Get-ChildItem -Path (Join-Path $Target "src\app") -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '^page \(\d+\)\.tsx$' } |
    ForEach-Object {
        Write-Host "Removing duplicate route: $($_.FullName)" -ForegroundColor Yellow
        Remove-Item -LiteralPath $_.FullName -Force
    }

Get-ChildItem -Path (Join-Path $Target "src\components") -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '^NavbarEnhancements \(\d+\)\.module\.css$' } |
    ForEach-Object {
        Write-Host "Removing duplicate navbar CSS: $($_.FullName)" -ForegroundColor Yellow
        Remove-Item -LiteralPath $_.FullName -Force
    }

Get-ChildItem -Path $Patch -Recurse -File | ForEach-Object {
    $relative = $_.FullName.Substring($Patch.Length).TrimStart('\\')
    $destination = Join-Path $Target $relative
    $destinationDir = Split-Path -Parent $destination

    if (-not (Test-Path $destinationDir)) {
        New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
    }

    Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
}

$Required = @(
    "src\app\page.tsx",
    "src\app\categories\page.tsx",
    "src\app\categories\CategoriesClient.tsx",
    "src\components\ValueSets.tsx",
    "src\components\ValueSets.module.css",
    "src\components\FlashDeals.tsx",
    "src\components\ProductSocialProof.tsx",
    "src\components\ProductValueOffer.tsx",
    "src\components\GlobalSearch.tsx",
    "src\components\MobileBottomNav.tsx",
    "src\components\NavbarEnhancements.module.css",
    "src\app\rtl-support.css"
)

$Missing = @()
foreach ($item in $Required) {
    $full = Join-Path $Target $item
    if (-not (Test-Path $full)) {
        $Missing += $item
    }
}

Write-Host ""
if ($Missing.Count -gt 0) {
    Write-Host "Missing critical files:" -ForegroundColor Red
    $Missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    throw "Repair copy did not complete correctly."
}

Write-Host "All critical Sarah frontend files are in place." -ForegroundColor Green
Write-Host ""
Write-Host "Now run:" -ForegroundColor Cyan
Write-Host "  cd C:\Users\hp\vi2"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Then test:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000"
Write-Host "  http://localhost:3000/categories"
Write-Host "  http://localhost:3000/shop"
