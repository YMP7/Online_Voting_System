# Setup Guide - SecureVote Frontend

This guide will help you set up and run the SecureVote frontend with your FastAPI backend.

## 📋 Prerequisites Checklist

- [ ] FastAPI backend is installed and configured
- [ ] Python 3.7+ is installed
- [ ] Modern web browser (Chrome, Firefox, Safari, or Edge)
- [ ] Text editor (VS Code, Sublime Text, etc.)

## 🔧 Backend Setup

### 1. Install Backend Dependencies

```bash
pip install fastapi uvicorn python-multipart pydantic[email] passlib[bcrypt] python-jose[cryptography] sqlalchemy
```

### 2. Enable CORS in Backend

Add this to your FastAPI backend file (before the routes):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Create an Admin User

Since admins can't be created through the UI, you need to create one via database:

**Option A: Using SQLite directly**

```bash
sqlite3 voting_system.db

# Inside SQLite shell:
UPDATE users SET is_admin = 1 WHERE username = 'your_username';
.exit
```

**Option B: Using Python script**

Create a file `create_admin.py`:

```python
from sqlalchemy import create_engine, update
from sqlalchemy.orm import sessionmaker
from your_backend_file import User, Base

engine = create_engine("sqlite:///./voting_system.db")
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

# Update existing user to admin
username = input("Enter username to make admin: ")
user = db.query(User).filter(User.username == username).first()
if user:
    user.is_admin = True
    db.commit()
    print(f"✅ {username} is now an admin!")
else:
    print("❌ User not found")

db.close()
```

### 4. Start Backend Server

```bash
python your_backend_file.py

# Or using uvicorn directly:
uvicorn your_backend_file:app --reload --host 0.0.0.0 --port 8000
```

Verify backend is running:
- Open browser: `http://localhost:8000/docs`
- You should see the API documentation

## 🌐 Frontend Setup

### 1. Configure Backend URL

Open `js/config.js` and verify the BASE_URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',  // ✅ Default
    ...
};
```

If your backend runs on a different port or host, change it here.

### 2. Start Frontend Server

Choose one of these methods:

**Method 1: Python HTTP Server (Simplest)**
```bash
# Navigate to frontend directory
cd path/to/frontend

# Start server on port 3000
python -m http.server 3000
```

**Method 2: Node.js HTTP Server**
```bash
# Install http-server globally (one-time)
npm install -g http-server

# Start server
http-server -p 3000
```

**Method 3: VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### 3. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## 🧪 Testing the Setup

### Test User Flow

1. **Register a Regular User**
   - Click "Register" button
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Submit

2. **Verify Login**
   - You should be logged in automatically
   - See the voting dashboard

3. **Logout**
   - Click "Logout" button
   - Should return to landing page

### Test Admin Flow

1. **Login as Admin**
   - Use the admin account you created earlier
   - Should see Admin Dashboard

2. **Create an Election**
   - Click "Create Election"
   - Title: `Test Election 2024`
   - Description: `This is a test election`
   - Submit

3. **Add Candidates**
   - Click "Add Candidate"
   - Select the election you created
   - Add 2-3 candidates with names and descriptions
   - Submit for each

4. **Start the Election**
   - Find your election in the list
   - Click "Start" button
   - Confirm

5. **View Results**
   - Click "Results" button
   - Should see chart and table (may be empty initially)

### Test Voting Flow

1. **Logout from Admin**

2. **Login as Regular User**
   - Use the test user account

3. **View Active Elections**
   - Should see the election you created as admin

4. **Cast a Vote**
   - Select a candidate (radio button)
   - Click "Cast Your Vote"
   - Confirm in the modal
   - Should see success message

5. **Verify One-Vote Policy**
   - Try to vote again in the same election
   - Should get "already voted" error

6. **Check Results (as Admin)**
   - Logout and login as admin
   - View results for the election
   - Should see 1 vote for your candidate

## 🐛 Troubleshooting

### Problem: "Failed to fetch" error

**Causes:**
- Backend not running
- Wrong BASE_URL in config.js
- CORS not configured

**Solutions:**
```bash
# 1. Check if backend is running
curl http://localhost:8000/

# 2. Check browser console for exact error
# Press F12 → Console tab

# 3. Verify CORS is enabled in backend

# 4. Try accessing backend directly
http://localhost:8000/docs
```

### Problem: "Invalid credentials" error

**Solutions:**
- Verify username/email and password are correct
- Check if user exists in database
- Try registering a new account

### Problem: "Admin access required" error

**Solutions:**
```bash
# Verify user is admin in database
sqlite3 voting_system.db
SELECT username, is_admin FROM users;
.exit

# If is_admin is 0, update it:
sqlite3 voting_system.db
UPDATE users SET is_admin = 1 WHERE username = 'admin_username';
.exit
```

### Problem: Modal won't close

**Solutions:**
- Click the X button in top-right
- Click outside the modal (on dark background)
- Press Escape key (if implemented)
- Refresh the page

### Problem: Styling looks broken

**Solutions:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Verify all CSS files loaded (check Network tab in DevTools)

## 📊 Monitoring & Debugging

### Backend Logs

```bash
# Watch backend logs in terminal where it's running
# You'll see all API requests and responses
```

### Frontend Logs

1. Open browser DevTools (F12)
2. Go to Console tab
3. Watch for errors or warnings
4. Check Network tab for API calls

### Database Inspection

```bash
# View all users
sqlite3 voting_system.db
SELECT * FROM users;

# View all elections
SELECT * FROM elections;

# View all votes
SELECT * FROM votes;

.exit
```

## 🎯 Quick Reference

### Default Ports
- **Backend:** `http://localhost:8000`
- **Frontend:** `http://localhost:3000`
- **API Docs:** `http://localhost:8000/docs`

### Important Files
- **Backend Config:** Your FastAPI Python file
- **Frontend Config:** `js/config.js`
- **Database:** `voting_system.db`
- **Styles:** `css/style.css`

### Common Commands

```bash
# Start backend
python backend.py

# Start frontend (Python)
python -m http.server 3000

# Check backend health
curl http://localhost:8000/

# View database
sqlite3 voting_system.db
```

## ✅ Setup Complete!

If you can:
- ✅ Access the landing page
- ✅ Register and login users
- ✅ Create elections as admin
- ✅ Cast votes as user
- ✅ View results as admin

Then your setup is complete! 🎉

## 📞 Need Help?

1. Check browser console for errors (F12)
2. Check backend terminal for API errors
3. Verify all dependencies are installed
4. Ensure CORS is properly configured
5. Try with a fresh database

## 🚀 Next Steps

- Add more users and test voting
- Create multiple elections
- Experiment with admin features
- Customize the design
- Add your own features

---

**Happy Voting! 🗳️**
