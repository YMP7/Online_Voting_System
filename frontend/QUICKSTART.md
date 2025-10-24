# ⚡ Quick Start Guide - SecureVote

Get up and running in 5 minutes!

## 🚀 Prerequisites

- ✅ FastAPI backend running on `http://localhost:8000`
- ✅ Python 3.7+ or Node.js installed
- ✅ Modern web browser

## 📝 3-Step Setup

### Step 1: Enable CORS in Backend

Add this to your FastAPI backend file (before routes):

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

### Step 2: Start Backend

```bash
python your_backend_file.py
```

Verify at: http://localhost:8000/docs

### Step 3: Start Frontend

Choose one method:

**Option A - Python:**
```bash
python -m http.server 3000
```

**Option B - Node.js:**
```bash
npx http-server -p 3000
```

Open: http://localhost:3000

## 🎯 First-Time Usage

### Create Admin User

```bash
# After registering a regular user, make them admin:
sqlite3 voting_system.db
UPDATE users SET is_admin = 1 WHERE username = 'your_username';
.exit
```

### Test the System

1. **Register** → Use any username/email/password
2. **Login** → Use your credentials
3. **As Admin:**
   - Create an election
   - Add 2-3 candidates
   - Start the election
4. **As User (new account):**
   - View active elections
   - Cast a vote
5. **As Admin:**
   - View results with charts

## ✅ You're Done!

The system is now fully operational. 

**For detailed docs:** See `README.md` and `SETUP_GUIDE.md`

## 🐛 Troubleshooting

**Can't connect?**
- Ensure backend is running: `curl http://localhost:8000/`
- Check CORS is enabled
- Verify port 3000 is available

**Can't login?**
- Clear browser localStorage (F12 → Application → Clear Storage)
- Check credentials
- Try registering a new account

**Admin features not working?**
```bash
sqlite3 voting_system.db
SELECT username, is_admin FROM users WHERE is_admin = 1;
```

## 📚 Next Steps

- Read `FEATURES.md` for full feature list
- Check `API_REFERENCE.md` for API details
- See `SETUP_GUIDE.md` for advanced setup

---

**Happy Voting! 🗳️**
