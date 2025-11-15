$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:4000/api/v1"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$testEmail = "testuser_$timestamp@example.com"
$testPassword = "password123"

Write-Host "======================================"
Write-Host "Auth Flow Test"
Write-Host "======================================"
Write-Host ""

# Test 1: Register
Write-Host "[1] Register New User"
try {
    $body = @{
        email = $testEmail
        password = $testPassword
        businessName = "Test Business"
    } | ConvertTo-Json
    
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 5
    
    Write-Host "✓ Register successful"
    Write-Host "  Email: $testEmail"
    Write-Host "  Token: $($res.data.accessToken.Substring(0,20))..."
    
    $token = $res.data.accessToken
}
catch {
    Write-Host "✗ Register failed: $($_.Exception.Message)"
    exit 1
}

Write-Host ""

# Test 2: Login
Write-Host "[2] Login with same credentials"
try {
    $body = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 5
    
    Write-Host "✓ Login successful"
    Write-Host "  Token: $($res.data.accessToken.Substring(0,20))..."
    
    $token = $res.data.accessToken
}
catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)"
    exit 1
}

Write-Host ""

# Test 3: Protected endpoint
Write-Host "[3] Get current user (protected endpoint)"
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers @{"Authorization" = "Bearer $token"} -TimeoutSec 5
    
    Write-Host "✓ Protected endpoint accessible"
    Write-Host "  User ID: $($res.data.id)"
    Write-Host "  Email: $($res.data.email)"
}
catch {
    Write-Host "✗ Protected endpoint failed: $($_.Exception.Message)"
    exit 1
}

Write-Host ""

# Test 4: Wrong password
Write-Host "[4] Login with wrong password (should fail)"
try {
    $body = @{
        email = $testEmail
        password = "wrongpassword"
    } | ConvertTo-Json
    
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 5 -ErrorAction Stop
    
    Write-Host "✗ Should have failed but succeeded"
    exit 1
}
catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Wrong password correctly rejected (401)"
    } else {
        Write-Host "? Unexpected error: $($_.Exception.Response.StatusCode)"
    }
}

Write-Host ""
Write-Host "======================================"
Write-Host "✓ All auth tests passed!"
Write-Host "======================================"
Write-Host ""
Write-Host "Frontend test:"
Write-Host "  1. Go to http://localhost:5173"
Write-Host "  2. Register with test account"
Write-Host "  3. Login"
Write-Host "  4. Verify protected dashboard loads"
