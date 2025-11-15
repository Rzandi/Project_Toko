# Backend Transactions API Test Script
# Run this script to test all transaction endpoints

# Color functions
function Write-Success { Write-Host $args[0] -ForegroundColor Green }
function Write-Error { Write-Host $args[0] -ForegroundColor Red }
function Write-Info { Write-Host $args[0] -ForegroundColor Cyan }
function Write-Header { Write-Host "`n=== $($args[0]) ===" -ForegroundColor Yellow }

$BASE_URL = "http://localhost:4000/api/v1"
$TOKEN = ""
$USER_ID = ""
$TX_ID = ""

# Test 1: Register
Write-Header "TEST 1: Register User"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/register" -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body @{
            email = "test@example.com"
            password = "password123"
            businessName = "Test Business"
        } | ConvertTo-Json
    
    Write-Success "✓ Registration successful"
    Write-Host $response
} catch {
    Write-Host "Note: User may already exist (expected on subsequent runs)"
}

# Test 2: Login
Write-Header "TEST 2: Login User"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body @{
            email = "test@example.com"
            password = "password123"
        }
    
    Write-Success "✓ Login successful"
    $TOKEN = $response.data.accessToken
    $USER_ID = $response.data.user.id
    Write-Host "Token: $($TOKEN.Substring(0, 20))..."
    Write-Host "User ID: $USER_ID"
} catch {
    Write-Error "✗ Login failed: $_"
    exit 1
}

# Test 3: Create Transaction (INCOME)
Write-Header "TEST 3: Create Transaction (INCOME)"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/transactions" -Method POST `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body @{
            date = (Get-Date -Format "yyyy-MM-dd")
            type = "INCOME"
            category = "Sales"
            description = "Product sales income"
            amount = 500000
            currency = "IDR"
            paymentMethod = "BANK_TRANSFER"
            notes = "Invoice #001"
        } | ConvertTo-Json
    
    if ($response.success) {
        Write-Success "✓ Transaction created successfully"
        $TX_ID = $response.data._id
        Write-Host "Transaction ID: $TX_ID"
        Write-Host (ConvertTo-Json $response.data)
    } else {
        Write-Error "✗ Creation failed: $($response.message)"
    }
} catch {
    Write-Error "✗ Request failed: $_"
}

# Test 4: Create Transaction (EXPENSE)
Write-Header "TEST 4: Create Transaction (EXPENSE)"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/transactions" -Method POST `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body @{
            date = (Get-Date -Format "yyyy-MM-dd")
            type = "EXPENSE"
            category = "Operating"
            description = "Office supplies"
            amount = 250000
            currency = "IDR"
            paymentMethod = "CASH"
            notes = "Weekly supplies"
        } | ConvertTo-Json
    
    if ($response.success) {
        Write-Success "✓ Expense transaction created"
        Write-Host "Transaction ID: $($response.data._id)"
    } else {
        Write-Error "✗ Creation failed: $($response.message)"
    }
} catch {
    Write-Error "✗ Request failed: $_"
}

# Test 5: List All Transactions
Write-Header "TEST 5: List Transactions"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/transactions" -Method GET `
        -Headers @{"Authorization" = "Bearer $TOKEN"}
    
    if ($response.success) {
        Write-Success "✓ Fetched transactions successfully"
        Write-Host "Total: $($response.pagination.total)"
        Write-Host "Transactions:"
        foreach ($tx in $response.data) {
            $type_emoji = if ($tx.type -eq "INCOME") { "📈" } else { "📉" }
            Write-Host "$type_emoji $($tx.description) - $($tx.amount) IDR ($($tx.category))"
        }
    } else {
        Write-Error "✗ Fetch failed: $($response.message)"
    }
} catch {
    Write-Error "✗ Request failed: $_"
}

# Test 6: List with Filters
Write-Header "TEST 6: List Transactions (INCOME only, limit 5)"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/transactions?type=INCOME&limit=5" -Method GET `
        -Headers @{"Authorization" = "Bearer $TOKEN"}
    
    if ($response.success) {
        Write-Success "✓ Filtered transactions fetched"
        Write-Host "Found: $($response.pagination.total) INCOME transactions"
    } else {
        Write-Error "✗ Fetch failed: $($response.message)"
    }
} catch {
    Write-Error "✗ Request failed: $_"
}

# Test 7: Get Single Transaction
if ($TX_ID -ne "") {
    Write-Header "TEST 7: Get Single Transaction"
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/transactions/$TX_ID" -Method GET `
            -Headers @{"Authorization" = "Bearer $TOKEN"}
        
        if ($response.success) {
            Write-Success "✓ Transaction retrieved"
            Write-Host (ConvertTo-Json $response.data -Depth 2)
        } else {
            Write-Error "✗ Fetch failed: $($response.message)"
        }
    } catch {
        Write-Error "✗ Request failed: $_"
    }
}

# Test 8: Update Transaction
if ($TX_ID -ne "") {
    Write-Header "TEST 8: Update Transaction"
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/transactions/$TX_ID" -Method PUT `
            -Headers @{
                "Authorization" = "Bearer $TOKEN"
                "Content-Type" = "application/json"
            } `
            -Body @{
                amount = 600000
                notes = "Updated amount via API test"
            } | ConvertTo-Json
        
        if ($response.success) {
            Write-Success "✓ Transaction updated"
            Write-Host "New amount: $($response.data.amount)"
            Write-Host "New notes: $($response.data.notes)"
        } else {
            Write-Error "✗ Update failed: $($response.message)"
        }
    } catch {
        Write-Error "✗ Request failed: $_"
    }
}

# Test 9: Delete Transaction
if ($TX_ID -ne "") {
    Write-Header "TEST 9: Delete Transaction"
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/transactions/$TX_ID" -Method DELETE `
            -Headers @{"Authorization" = "Bearer $TOKEN"}
        
        if ($response.success) {
            Write-Success "✓ Transaction deleted"
            Write-Host $response.message
        } else {
            Write-Error "✗ Deletion failed: $($response.message)"
        }
    } catch {
        Write-Error "✗ Request failed: $_"
    }
}

# Summary
Write-Header "TEST SUMMARY"
Write-Success "✓ All tests completed!"
Write-Info "
Next steps:
1. Check if all tests passed (green ✓)
2. Open frontend at http://localhost:5173
3. Login with test@example.com / password123
4. Navigate to /transactions
5. Try creating/editing/deleting transactions
6. Check Network tab in DevTools to verify API calls
"
