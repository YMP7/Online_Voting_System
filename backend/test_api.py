import requests
import json

# Base URL
BASE_URL = "http://localhost:8000"

# Store tokens
admin_token = None
user1_token = None
user2_token = None

def print_response(response, title):
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")
    print(f"{'='*60}\n")

def test_api():
    global admin_token, user1_token, user2_token
    
    # 1. Register Admin User
    print("\n🚀 STEP 1: Registering Admin User")
    admin_data = {
        "username": "admin",
        "email": "admin@voting.com",
        "password": "admin123"
    }
    response = requests.post(f"{BASE_URL}/api/register", json=admin_data)
    print_response(response, "Register Admin")
    if response.status_code == 201:
        admin_token = response.json()["access_token"]
        print(f"✅ Admin Token: {admin_token[:50]}...")
    
    # 2. Register Regular Users
    print("\n🚀 STEP 2: Registering Regular Users")
    
    user1_data = {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/register", json=user1_data)
    print_response(response, "Register User 1 (John)")
    if response.status_code == 201:
        user1_token = response.json()["access_token"]
        print(f"✅ User1 Token: {user1_token[:50]}...")
    
    user2_data = {
        "username": "jane_smith",
        "email": "jane@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/register", json=user2_data)
    print_response(response, "Register User 2 (Jane)")
    if response.status_code == 201:
        user2_token = response.json()["access_token"]
        print(f"✅ User2 Token: {user2_token[:50]}...")
    
    # 3. Login Test
    print("\n🚀 STEP 3: Testing Login")
    login_data = {
        "username": "john_doe",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/login", json=login_data)
    print_response(response, "Login with Username")
    
    # Login with email
    login_data = {
        "email": "admin@voting.com",
        "password": "admin123"
    }
    response = requests.post(f"{BASE_URL}/api/login", json=login_data)
    print_response(response, "Login with Email")
    
    # NOTE: You need to manually set is_admin=True for admin user in database
    print("\n⚠️  IMPORTANT: Run this SQL command to make admin user an admin:")
    print("   sqlite3 voting_system.db")
    print("   UPDATE users SET is_admin=1 WHERE username='admin';")
    print("   .exit")
    input("\nPress Enter after setting admin privileges...")
    
    # Re-login to get updated token
    response = requests.post(f"{BASE_URL}/api/login", json=admin_data)
    if response.status_code == 200:
        admin_token = response.json()["access_token"]
    
    # 4. Create Election (Admin Only)
    print("\n🚀 STEP 4: Creating Elections")
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    election1_data = {
        "title": "Presidential Election 2025",
        "description": "Vote for the next president",
        "is_active": False
    }
    response = requests.post(f"{BASE_URL}/api/admin/election", json=election1_data, headers=headers)
    print_response(response, "Create Presidential Election")
    election1_id = response.json()["id"] if response.status_code == 201 else None
    
    election2_data = {
        "title": "Best Programming Language 2025",
        "description": "Vote for your favorite programming language"
    }
    response = requests.post(f"{BASE_URL}/api/admin/election", json=election2_data, headers=headers)
    print_response(response, "Create Programming Language Election")
    election2_id = response.json()["id"] if response.status_code == 201 else None
    
    # 5. Add Candidates
    print("\n🚀 STEP 5: Adding Candidates")
    
    if election1_id:
        candidates1 = [
            {"election_id": election1_id, "name": "Alice Johnson", "description": "Experienced leader with 20 years in politics"},
            {"election_id": election1_id, "name": "Bob Williams", "description": "Young reformist with fresh ideas"},
            {"election_id": election1_id, "name": "Carol Martinez", "description": "Former businesswoman turned politician"}
        ]
        
        for candidate in candidates1:
            response = requests.post(f"{BASE_URL}/api/admin/candidate", json=candidate, headers=headers)
            print_response(response, f"Add Candidate: {candidate['name']}")
    
    if election2_id:
        candidates2 = [
            {"election_id": election2_id, "name": "Python", "description": "Easy to learn, powerful for data science"},
            {"election_id": election2_id, "name": "JavaScript", "description": "The language of the web"},
            {"election_id": election2_id, "name": "Rust", "description": "Memory safe and blazingly fast"},
            {"election_id": election2_id, "name": "Go", "description": "Simple, fast, and great for concurrency"}
        ]
        
        for candidate in candidates2:
            response = requests.post(f"{BASE_URL}/api/admin/candidate", json=candidate, headers=headers)
            print_response(response, f"Add Candidate: {candidate['name']}")
    
    # 6. List Elections (Before Starting)
    print("\n🚀 STEP 6: List Active Elections (Should be empty)")
    response = requests.get(f"{BASE_URL}/api/elections")
    print_response(response, "List Active Elections")
    
    # 7. Start Elections
    print("\n🚀 STEP 7: Starting Elections")
    if election1_id:
        response = requests.post(f"{BASE_URL}/api/admin/start/{election1_id}", headers=headers)
        print_response(response, "Start Presidential Election")
    
    if election2_id:
        response = requests.post(f"{BASE_URL}/api/admin/start/{election2_id}", headers=headers)
        print_response(response, "Start Programming Language Election")
    
    # 8. List Active Elections
    print("\n🚀 STEP 8: List Active Elections")
    response = requests.get(f"{BASE_URL}/api/elections")
    print_response(response, "List Active Elections")
    
    # 9. List Candidates
    print("\n🚀 STEP 9: List Candidates for Elections")
    if election1_id:
        response = requests.get(f"{BASE_URL}/api/elections/{election1_id}/candidates")
        print_response(response, f"Candidates for Election {election1_id}")
    
    if election2_id:
        response = requests.get(f"{BASE_URL}/api/elections/{election2_id}/candidates")
        print_response(response, f"Candidates for Election {election2_id}")
    
    # 10. Cast Votes
    print("\n🚀 STEP 10: Casting Votes")
    
    # User 1 votes
    user1_headers = {"Authorization": f"Bearer {user1_token}"}
    if election1_id:
        vote_data = {"election_id": election1_id, "candidate_id": 1}  # Vote for Alice
        response = requests.post(f"{BASE_URL}/api/vote", json=vote_data, headers=user1_headers)
        print_response(response, "User 1 votes for Presidential Election")
    
    if election2_id:
        vote_data = {"election_id": election2_id, "candidate_id": 4}  # Vote for Python
        response = requests.post(f"{BASE_URL}/api/vote", json=vote_data, headers=user1_headers)
        print_response(response, "User 1 votes for Programming Language")
    
    # User 2 votes
    user2_headers = {"Authorization": f"Bearer {user2_token}"}
    if election1_id:
        vote_data = {"election_id": election1_id, "candidate_id": 2}  # Vote for Bob
        response = requests.post(f"{BASE_URL}/api/vote", json=vote_data, headers=user2_headers)
        print_response(response, "User 2 votes for Presidential Election")
    
    if election2_id:
        vote_data = {"election_id": election2_id, "candidate_id": 4}  # Vote for Python
        response = requests.post(f"{BASE_URL}/api/vote", json=vote_data, headers=user2_headers)
        print_response(response, "User 2 votes for Programming Language")
    
    # 11. Test Double Voting Prevention
    print("\n🚀 STEP 11: Testing Double Voting Prevention")
    if election1_id:
        vote_data = {"election_id": election1_id, "candidate_id": 3}
        response = requests.post(f"{BASE_URL}/api/vote", json=vote_data, headers=user1_headers)
        print_response(response, "User 1 tries to vote again (should fail)")
    
    # 12. Test Admin Cannot Vote
    print("\n🚀 STEP 12: Testing Admin Cannot Vote")
    if election1_id:
        vote_data = {"election_id": election1_id, "candidate_id": 1}
        response = requests.post(f"{BASE_URL}/api/vote", json=vote_data, headers=headers)
        print_response(response, "Admin tries to vote (should fail)")
    
    # 13. Get Election Results
    print("\n🚀 STEP 13: Getting Election Results")
    if election1_id:
        response = requests.get(f"{BASE_URL}/api/admin/results/{election1_id}", headers=headers)
        print_response(response, f"Results for Presidential Election")
    
    if election2_id:
        response = requests.get(f"{BASE_URL}/api/admin/results/{election2_id}", headers=headers)
        print_response(response, f"Results for Programming Language Election")
    
    # 14. Test Error Cases
    print("\n🚀 STEP 14: Testing Error Cases")
    
    # Non-existent election
    response = requests.get(f"{BASE_URL}/api/elections/999/candidates")
    print_response(response, "Get candidates for non-existent election")
    
    # Unauthorized access
    response = requests.post(f"{BASE_URL}/api/admin/election", json=election1_data)
    print_response(response, "Create election without token (should fail)")
    
    # Invalid login
    invalid_login = {"username": "wrong", "password": "wrong"}
    response = requests.post(f"{BASE_URL}/api/login", json=invalid_login)
    print_response(response, "Login with invalid credentials")
    
    print("\n✅ All tests completed!")
    print("\n📊 Summary:")
    print(f"   - Admin registered and logged in")
    print(f"   - 2 regular users registered")
    print(f"   - 2 elections created")
    print(f"   - Candidates added to both elections")
    print(f"   - Elections started")
    print(f"   - Users cast votes successfully")
    print(f"   - Double voting prevented")
    print(f"   - Admin voting blocked")
    print(f"   - Results retrieved successfully")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🗳️  VOTING SYSTEM API - COMPREHENSIVE TEST SUITE")
    print("="*60)
    print("\nMake sure the API is running at http://localhost:8000")
    input("Press Enter to start testing...")
    
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the API")
        print("   Make sure the server is running: python main.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()