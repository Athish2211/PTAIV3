import requests
import json
import sys

BASE_URL = "http://localhost:8000"
ENDPOINTS = [
    "/api/health",
    "/api/docs",
    "/api/v1/patients",
    "/api/v1/prescriptions",
    "/api/v1/analytics/cohorts",
    "/api/v1/search?q=test"
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
        # Any successful response, or a 401/403 (unauthorized, but means the endpoint exists)
        if response.status_code in [200, 201, 202, 401, 403]:
            print(f"OK ({response.status_code})")
            passed += 1
        elif response.status_code == 405: # Method not allowed (maybe it expects POST)
            print(f"OK ({response.status_code} - Method Not Allowed)")
            passed += 1
        else:
            print(f"FAIL ({response.status_code})")
            failed += 1
            errors.append(f"{endpoint} returned {response.status_code}: {response.text[:100]}")
    except requests.exceptions.RequestException as e:
        print(f"ERROR: {str(e)}")
        failed += 1
        errors.append(f"{endpoint} connection error: {str(e)}")

print("-" * 50)
print(f"Test complete. {passed} endpoints responding successfully.")
if failed > 0:
    print(f"Found {failed} failures:")
    for err in errors:
        print(f"  - {err}")
    sys.exit(1)
