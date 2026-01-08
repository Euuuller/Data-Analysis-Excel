# ============================================
# PROJECT STRUCTURE REFACTORING SCRIPT
# Data-Analysis-Excel - Professional Reorganization
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PROJECT STRUCTURE REFACTORING" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ============================================
# STEP 1: Create new directory structure
# ============================================
Write-Host "STEP 1: Creating new directory structure..." -ForegroundColor Yellow

# Create assets directory
New-Item -ItemType Directory -Path "assets" -Force | Out-Null
New-Item -ItemType Directory -Path "assets\css" -Force | Out-Null
New-Item -ItemType Directory -Path "assets\js" -Force | Out-Null

# Create data/analysis directory
New-Item -ItemType Directory -Path "data\analysis" -Force | Out-Null

# Create .gitkeep for processed folder
New-Item -ItemType File -Path "data\processed\.gitkeep" -Force | Out-Null

Write-Host "  ✓ Directory structure created" -ForegroundColor Green

# ============================================
# STEP 2: Move files to new locations
# ============================================
Write-Host "`nSTEP 2: Moving files to new structure..." -ForegroundColor Yellow

# Move CSS files
Move-Item -Path "src\css\styles.css" -Destination "assets\css\styles.css" -Force
Write-Host "  ✓ Moved styles.css" -ForegroundColor Green

# Move JS files
Move-Item -Path "src\js\app.js" -Destination "assets\js\app.js" -Force
Move-Item -Path "src\js\cohortCharts.js" -Destination "assets\js\cohortCharts.js" -Force
Move-Item -Path "src\js\dataLoader.js" -Destination "assets\js\dataLoader.js" -Force
Write-Host "  ✓ Moved JavaScript files" -ForegroundColor Green

# Move Excel file to data/analysis
Move-Item -Path "Data-Analysis-Excel.xlsx" -Destination "data\analysis\Data-Analysis-Excel.xlsx" -Force
Write-Host "  ✓ Moved Excel workbook to data/analysis/" -ForegroundColor Green

# Rename PDF documentation file
Move-Item -Path "docs\Ciclo 04 - Projeto do Aluno.pdf" -Destination "docs\project-requirements.pdf" -Force
Write-Host "  ✓ Renamed PDF to project-requirements.pdf" -ForegroundColor Green
Write-Host "  ℹ analise.md kept as-is (temporary file)" -ForegroundColor DarkGray

# ============================================
# STEP 3: Remove old empty directories
# ============================================
Write-Host "`nSTEP 3: Cleaning up old structure..." -ForegroundColor Yellow

Remove-Item -Path "src\css" -Recurse -Force
Remove-Item -Path "src\js" -Recurse -Force
Remove-Item -Path "src" -Recurse -Force
Write-Host "  ✓ Removed old src/ directory" -ForegroundColor Green

# ============================================
# STEP 4: Update index.html file references
# ============================================
Write-Host "`nSTEP 4: Updating file references in index.html..." -ForegroundColor Yellow

# Read the file
$indexContent = Get-Content -Path "index.html" -Raw

# Update CSS path
$indexContent = $indexContent -replace 'src/css/styles\.css', 'assets/css/styles.css'

# Update JS paths
$indexContent = $indexContent -replace 'src/js/dataLoader\.js', 'assets/js/dataLoader.js'
$indexContent = $indexContent -replace 'src/js/cohortCharts\.js', 'assets/js/cohortCharts.js'
$indexContent = $indexContent -replace 'src/js/app\.js', 'assets/js/app.js'

# Write back to file
Set-Content -Path "index.html" -Value $indexContent -NoNewline

Write-Host "  ✓ Updated index.html references" -ForegroundColor Green

# ============================================
# FINAL SUMMARY
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✓ REFACTORING COMPLETED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nNew structure:" -ForegroundColor Yellow
Write-Host "  📁 assets/css/       - Stylesheets" -ForegroundColor White
Write-Host "  📁 assets/js/        - JavaScript files" -ForegroundColor White
Write-Host "  📁 data/raw/         - Source CSV data" -ForegroundColor White
Write-Host "  📁 data/processed/   - Transformed data" -ForegroundColor White
Write-Host "  📁 data/analysis/    - Excel workbooks" -ForegroundColor White
Write-Host "  📁 docs/             - Documentation" -ForegroundColor White

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Test the dashboard: Open index.html in browser" -ForegroundColor White
Write-Host "  2. Review changes: git status" -ForegroundColor White
Write-Host "  3. Commit: git add . ; git commit -m 'refactor: reorganize project structure'" -ForegroundColor White
Write-Host "`n"

