# API Reference - SecureVote

Quick reference for all API endpoints used in the frontend.

## 🔐 Authentication

### Register User
```
POST /api/register
Content-Type: application/json

Request:
{
    "username": "string",
    "email": "string",
    "password": "string"
}

Response: 201 Created
{
    "access_token": "string",
    "token_type": "bearer",
    "is_admin": boolean
}
```

### Login User
```
POST /api/login
Content-Type: application/json

Request:
{
    "username": "string",     // Optional: provide username OR email
    "email": "string",         // Optional: provide username OR email
    "password": "string"
}

Response: 200 OK
{
    "access_token": "string",
    "token_type": "bearer",
    "is_admin": boolean
}
```

## 🗳️ User Endpoints

### Get Active Elections
```
GET /api/elections
Authorization: Bearer {token}

Response: 200 OK
[
    {
        "id": integer,
        "title": "string",
        "description": "string",
        "is_active": boolean,
        "created_at": "datetime"
    }
]
```

### Get Election Candidates
```
GET /api/elections/{election_id}/candidates
Authorization: Bearer {token}

Response: 200 OK
[
    {
        "id": integer,
        "election_id": integer,
        "name": "string",
        "description": "string",
        "created_at": "datetime"
    }
]
```

### Cast Vote
```
POST /api/vote
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
    "election_id": integer,
    "candidate_id": integer
}

Response: 201 Created
{
    "message": "Vote cast successfully"
}

Errors:
- 400: Election not active
- 400: Already voted in this election
- 403: Admins cannot vote
- 404: Election or candidate not found
```

## 👑 Admin Endpoints

### Create Election
```
POST /api/admin/election
Authorization: Bearer {admin_token}
Content-Type: application/json

Request:
{
    "title": "string",
    "description": "string",      // Optional
    "is_active": boolean          // Optional, default: false
}

Response: 201 Created
{
    "id": integer,
    "title": "string",
    "description": "string",
    "is_active": boolean,
    "created_at": "datetime"
}

Error:
- 403: Admin access required
```

### Add Candidate
```
POST /api/admin/candidate
Authorization: Bearer {admin_token}
Content-Type: application/json

Request:
{
    "election_id": integer,
    "name": "string",
    "description": "string"       // Optional
}

Response: 201 Created
{
    "id": integer,
    "election_id": integer,
    "name": "string",
    "description": "string",
    "created_at": "datetime"
}

Errors:
- 403: Admin access required
- 404: Election not found
```

### Start Election
```
POST /api/admin/start/{election_id}
Authorization: Bearer {admin_token}

Response: 200 OK
{
    "id": integer,
    "title": "string",
    "description": "string",
    "is_active": true,
    "created_at": "datetime"
}

Errors:
- 400: Cannot start election without candidates
- 403: Admin access required
- 404: Election not found
```

### Get Election Results
```
GET /api/admin/results/{election_id}
Authorization: Bearer {admin_token}

Response: 200 OK
{
    "election_id": integer,
    "election_title": "string",
    "total_votes": integer,
    "results": [
        {
            "candidate_id": integer,
            "candidate_name": "string",
            "vote_count": integer
        }
    ]
}

Errors:
- 403: Admin access required
- 404: Election not found
```

## 🔧 Request Headers

All authenticated requests must include:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## 📊 Response Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Invalid or expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

## 🔒 Authentication Flow

### 1. Register/Login
```javascript
// Register
const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'john_doe',
        email: 'john@example.com',
        password: 'securepass123'
    })
});

const data = await response.json();
// Store token: data.access_token
```

### 2. Store Token
```javascript
localStorage.setItem('voting_token', data.access_token);
localStorage.setItem('voting_is_admin', data.is_admin);
```

### 3. Use Token in Requests
```javascript
const token = localStorage.getItem('voting_token');

const response = await fetch('/api/elections', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

## 🎯 Frontend Integration Examples

### Example: Load Elections
```javascript
async function loadElections() {
    const token = localStorage.getItem('voting_token');
    
    try {
        const response = await fetch('http://localhost:8000/api/elections', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load elections');
        }
        
        const elections = await response.json();
        return elections;
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

### Example: Cast Vote
```javascript
async function castVote(electionId, candidateId) {
    const token = localStorage.getItem('voting_token');
    
    try {
        const response = await fetch('http://localhost:8000/api/vote', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                election_id: electionId,
                candidate_id: candidateId
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

### Example: Get Results (Admin)
```javascript
async function getResults(electionId) {
    const token = localStorage.getItem('voting_token');
    
    try {
        const response = await fetch(
            `http://localhost:8000/api/admin/results/${electionId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }
        
        const results = await response.json();
        return results;
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

## 🚨 Error Handling

### Common Error Patterns

```javascript
try {
    const response = await fetch(endpoint, options);
    
    // Check if response is OK
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Request failed');
    }
    
    // Handle empty responses (204 No Content)
    if (response.status === 204) {
        return { success: true };
    }
    
    const data = await response.json();
    return data;
    
} catch (error) {
    // Network errors
    if (error instanceof TypeError) {
        console.error('Network error:', error);
        throw new Error('Cannot connect to server');
    }
    
    // API errors
    console.error('API error:', error);
    throw error;
}
```

## 🔄 Token Expiration

Tokens expire after 30 minutes. Handle expired tokens:

```javascript
// Check for 401 Unauthorized
if (response.status === 401) {
    // Clear stored token
    localStorage.removeItem('voting_token');
    
    // Redirect to login
    window.location.href = '/';
}
```

## 📝 Data Models

### User
```typescript
{
    id: number
    username: string
    email: string
    is_admin: boolean
    created_at: string (ISO 8601)
}
```

### Election
```typescript
{
    id: number
    title: string
    description: string | null
    is_active: boolean
    created_at: string (ISO 8601)
}
```

### Candidate
```typescript
{
    id: number
    election_id: number
    name: string
    description: string | null
    created_at: string (ISO 8601)
}
```

### Vote Result
```typescript
{
    candidate_id: number
    candidate_name: string
    vote_count: number
}
```

### Election Results
```typescript
{
    election_id: number
    election_title: string
    total_votes: number
    results: VoteResult[]
}
```

## 🧪 Testing with curl

### Register User
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Get Elections
```bash
curl -X GET http://localhost:8000/api/elections \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Cast Vote
```bash
curl -X POST http://localhost:8000/api/vote \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"election_id":1,"candidate_id":1}'
```

---

**For more details, visit the interactive API docs at: `http://localhost:8000/docs`**
