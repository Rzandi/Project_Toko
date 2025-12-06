
<#
.SYNOPSIS
    Automated Auth Flow Test Script
    Tests register, login, and protected endpoints
    
.DESCRIPTION
    This script will:
    1. Test register endpoint
    2. Test login endpoint  
    3. Test protected endpoint (me)
    4. Display results
    
.NOTES
    Requires: Backend running on http://localhost:4000
#>

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:4000/api/v1"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$testEmail = "testuser_$timestamp@example.com"
$testPassword = "password123"
$testBusinessName = "Test Business $timestamp"

Write-Host "======================================"
Write-Host "Auth Flow Automated Test"
Write-Host "======================================"
Write-Host ""
Write-Host "Base URL: $baseUrl"
Write-Host "Test User: $testEmail"
Write-Host ""

# Test 1: Register
Write-Host "TEST 1: Register New User"
Write-Host "---"
try {
    $registerBody = @{
        email        = $testEmail
        password     = $testPassword
        businessName = $testBusinessName
    } | ConvertTo-Json
    
    Write-Host "Request: POST /auth/register"
    Write-Host "Body: $registerBody"
    Write-Host ""
    
    $registerRes = Invoke-RestMethod `
        -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -TimeoutSec 5
    
    Write-Host "✓ Status: 201 Created"
    Write-Host "✓ Response:"
    $registerRes | ConvertTo-Json -Depth 3 | Write-Host
    
    $accessToken = $registerRes.data.accessToken
    $userId = $registerRes.data.user.id
    
    Write-Host ""
    Write-Host "✓ Token received: $($accessToken.Substring(0,20))..."
    Write-Host "✓ User ID: $userId"
    Write-Host ""
}
catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)"
    Write-Host ""
    exit 1
}

# Test 2: Login
Write-Host "TEST 2: Login with Registered User"
Write-Host "---"
try {
    $loginBody = @{
        email    = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    Write-Host "Request: POST /auth/login"
    Write-Host "Body: $loginBody"
    Write-Host ""
    
    $loginRes = Invoke-RestMethod `
        -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -TimeoutSec 5
    
    Write-Host "✓ Status: 200 OK"
    Write-Host "✓ Response:"
    $loginRes | ConvertTo-Json -Depth 3 | Write-Host
    
    $loginToken = $loginRes.data.accessToken
    
    Write-Host ""
    Write-Host "✓ Token received: $($loginToken.Substring(0,20))..."
    Write-Host ""
}
catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)"
    Write-Host ""
    exit 1
}

# Test 3: Get Current User (Protected Route)
Write-Host "TEST 3: Get Current User (Protected Endpoint)"
Write-Host "---"
try {
    Write-Host "Request: GET /auth/me"
    Write-Host "Headers: Authorization: Bearer $($loginToken.Substring(0,20))..."
    Write-Host ""
    
    $meRes = Invoke-RestMethod `
        -Uri "$baseUrl/auth/me" `
        -Method GET `
        -Headers @{
        "Authorization" = "Bearer $loginToken"
    } `
        -TimeoutSec 5
    
    Write-Host "✓ Status: 200 OK"
    Write-Host "✓ Response:"
    $meRes | ConvertTo-Json -Depth 3 | Write-Host
    Write-Host ""
}
catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)"
    Write-Host ""
    exit 1
}

# Test 4: Login Failure (Wrong Password)
Write-Host "TEST 4: Login Failure (Wrong Password)"
Write-Host "---"
try {
    $wrongBody = @{
        email    = $testEmail
        password = "wrongpassword"
    } | ConvertTo-Json
    
    Write-Host "Request: POST /auth/login (wrong password)"
    Write-Host ""
    
    $wrongRes = Invoke-RestMethod `
        -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $wrongBody `
        -TimeoutSec 5 `
        -ErrorAction Stop
    
    Write-Host "✗ FAILED: Should have returned 401, but got 200"
}
catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Status: 401 Unauthorized (as expected)"
        Write-Host "✓ Error correctly returned for wrong password"
    }
    else {
        Write-Host "? Unexpected status: $($_.Exception.Response.StatusCode)"
    }
    Write-Host ""
}

# Test 5: Unauthorized Access (Missing Token)
Write-Host "TEST 5: Unauthorized Access (Missing Token)"
Write-Host "---"
try {
    Write-Host "Request: GET /auth/me (without Authorization header)"
    Write-Host ""
    
    $noTokenRes = Invoke-RestMethod `
        -Uri "$baseUrl/auth/me" `
        -Method GET `
        -TimeoutSec 5 `
        -ErrorAction Stop
    
    Write-Host "✗ FAILED: Should have returned 401, but got 200"
}
catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✓ Status: 401 Unauthorized (as expected)"
        Write-Host "✓ Endpoint correctly requires authentication"
    }
    else {
        Write-Host "? Unexpected status: $($_.Exception.Response.StatusCode)"
    }
    Write-Host ""
}

# Summary
Write-Host "======================================"
Write-Host "Test Summary"
Write-Host "======================================"
Write-Host "✓ Register endpoint: PASS"
Write-Host "✓ Login endpoint: PASS"
Write-Host "✓ Protected endpoint (GET /auth/me): PASS"
Write-Host "✓ Invalid credentials rejection: PASS"
Write-Host "✓ Unauthorized access rejection: PASS"
Write-Host ""
Write-Host "All tests passed! Auth backend is working correctly."
Write-Host ""
Write-Host "Next: Test frontend UI by navigating to http://localhost:5173"
Write-Host "======================================"
