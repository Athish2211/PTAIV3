import requests
import json
import sys

BASE_URL = "http://localhost:8000"
ENDPOINTS = [
    "/health",
    "/api/health",
    "/api/v1/health",
    "/api/patients",
    "/api/prescriptions",
    "/api/analytics",
    "/docs"
]

print("Starting API Functional Test Suite...")
print("-" * 50)

passed = 0
failed = 0
errors = []

for endpoint in ENDPOINTS:
    url = f"{BASE_URL}{endpoint}"
    print(f"Testing {url} ...", end=" ")
    try:
        response = requests.get(url, timeout=5)
        if response.status_code in [200, 201, 202, 401, 403]: # 401/403 are fine, it means the API is responding but needs auth
            print(f"OK ({response.status_code})")
            passed += 1
        elif response.status_code == 404:
            print(f"NOT FOUND (404)")
            # 404s are expected if we guess the prefix wrong, we won't count as failure immediately
        else:
            print(f"FAIL ({response.status_code})")
            failed += 1
            errors.append(f"{endpoint} returned {response.status_code}: {response.text[:100]}")
    except requests.exceptions.RequestException as e:
        print(f"ERROR: {str(e)}")
        failed += 1
        errors.append(f"{endpoint} connection error: {str(e)}")

print("-" * 50)
print(f"Test complete. {passed} endpoints responding.")
if failed > 0:
    print(f"Found {failed} failures:")
    for err in errors:
        print(f"  - {err}")
    sys.exit(1)
