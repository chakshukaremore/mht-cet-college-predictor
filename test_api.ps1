# PowerShell Script to Test MHT CET Admission Analytics REST APIs

Write-Host "Waiting 5 seconds for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$BaseUrl = "http://localhost:8080/api"

# 1. Test GET /colleges
Write-Host "`n1. Testing GET /colleges..." -ForegroundColor Cyan
try {
    $Colleges = Invoke-RestMethod -Uri "$BaseUrl/colleges" -Method Get
    Write-Host "Success! Retrieved $($Colleges.Count) colleges." -ForegroundColor Green
    $Colleges | Select-Object -First 3 | Format-Table id, code, name, city, status
} catch {
    Write-Error "Failed to fetch colleges: $_"
}

# 2. Test GET /colleges/1
Write-Host "`n2. Testing GET /colleges/1..." -ForegroundColor Cyan
try {
    $College = Invoke-RestMethod -Uri "$BaseUrl/colleges/1" -Method Get
    Write-Host "Success! Retrieved College details:" -ForegroundColor Green
    $College | Format-List id, code, name, city, status
} catch {
    Write-Error "Failed to fetch college 1: $_"
}

# 3. Test GET /colleges/1/cutoffs
Write-Host "`n3. Testing GET /colleges/1/cutoffs..." -ForegroundColor Cyan
try {
    $Cutoffs = Invoke-RestMethod -Uri "$BaseUrl/colleges/1/cutoffs" -Method Get
    Write-Host "Success! Retrieved $($Cutoffs.Count) cutoff records for college 1." -ForegroundColor Green
    $Cutoffs | Select-Object -First 3 | Format-Table branchCode, branchName, year, round, category, cutoffPercentile
} catch {
    Write-Error "Failed to fetch cutoffs: $_"
}

# 4. Test POST /predict
Write-Host "`n4. Testing POST /predict..." -ForegroundColor Cyan
$Payload = @{
    percentile = 98.5
    category = "OPEN"
} | ConvertTo-Json

try {
    $Headers = @{ "Content-Type" = "application/json" }
    $Prediction = Invoke-RestMethod -Uri "$BaseUrl/predict" -Method Post -Body $Payload -Headers $Headers
    Write-Host "Success! Retrieved predictions." -ForegroundColor Green
    Write-Host "Safe colleges count: $($Prediction.safe.Count)" -ForegroundColor Green
    Write-Host "Moderate colleges count: $($Prediction.moderate.Count)" -ForegroundColor Green
    Write-Host "Dream colleges count: $($Prediction.dream.Count)" -ForegroundColor Green

    Write-Host "`nSample Moderate Recommendations:" -ForegroundColor Yellow
    $Prediction.moderate | Select-Object -First 3 | ForEach-Object {
        [PSCustomObject]@{
            College = $_.college.name
            Branch = $_.branchName
            Category = $_.category
            CutoffPercentile = $_.cutoffPercentile
        }
    } | Format-Table
} catch {
    Write-Error "Failed to fetch predictions: $_"
}
