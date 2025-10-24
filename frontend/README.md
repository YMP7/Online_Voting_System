# SecureVote - Online Voting System

A beautiful, professional, and secure online voting platform with separate interfaces for voters and administrators. Built with vanilla JavaScript, HTML5, and CSS3.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

### User Features
- ✅ **Secure Authentication** - Register and login with email/username
- ✅ **View Active Elections** - Browse all ongoing elections
- ✅ **Cast Votes** - Vote for candidates with confirmation dialog
- ✅ **One Vote Per Election** - System prevents duplicate voting
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Admin Features
- ✅ **Create Elections** - Set up new elections with descriptions
- ✅ **Add Candidates** - Add candidates to any election
- ✅ **Start Elections** - Activate elections when ready
- ✅ **View Results** - Real-time results with interactive charts
- ✅ **Visual Analytics** - Beautiful bar charts showing vote distribution
- ✅ **Results Table** - Detailed breakdown with percentages and rankings

## 🎨 Design Highlights

- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Professional Color Scheme** - Gradient backgrounds and consistent styling
- **Accessibility** - High contrast, clear typography, and semantic HTML
- **Mobile-First** - Fully responsive design for all screen sizes
- **Interactive Elements** - Hover effects, transitions, and visual feedback
- **Chart Visualizations** - Chart.js integration for beautiful data display

## 📁 Project Structure

```
voting-system-frontend/
├── index.html              # Main HTML file (17KB)
├── css/
│   └── style.css          # Complete styling with CSS variables (20KB)
├── js/
│   ├── config.js          # API configuration (833B)
│   ├── api.js             # API service layer (4.2KB)
│   ├── auth.js            # Authentication & UI management (7KB)
│   ├── user.js            # User dashboard functionality (5.5KB)
│   ├── admin.js           # Admin dashboard functionality (11KB)
│   └── main.js            # Application initialization (6.4KB)
├── README.md              # Main documentation (9KB)
├── QUICKSTART.md          # 5-minute setup guide (2KB)
├── SETUP_GUIDE.md         # Detailed setup instructions (7.4KB)
├── API_REFERENCE.md       # Complete API documentation (10KB)
├── FEATURES.md            # Feature showcase (10KB)
├── PROJECT_SUMMARY.md     # Project overview (10KB)
├── FILE_GUIDE.md          # File reference guide (9KB)
└── .gitignore             # Git ignore patterns
```

## 🚀 Quick Start

### Prerequisites

1. **Backend Server** - Ensure your FastAPI backend is running on `http://localhost:8000`
2. **Modern Browser** - Chrome, Firefox, Safari, or Edge (latest versions)

### Installation

1. **Clone or download this frontend project**

2. **Configure Backend URL**
   
   Open `js/config.js` and update the `BASE_URL` if your backend is on a different host/port:
   
   ```javascript
   const API_CONFIG = {
       BASE_URL: 'http://localhost:8000',  // Change this if needed
       ...
   };
   ```

3. **Serve the Application**
   
   You can use any static file server. Here are some options:

   **Option A: Python HTTP Server**
   ```bash
   python -m http.server 3000
   ```
   
   **Option B: Node.js HTTP Server**
   ```bash
   npx http-server -p 3000
   ```
   
   **Option C: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

4. **Access the Application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📖 Usage Guide

### For Regular Users

1. **Register an Account**
   - Click "Register" button
   - Fill in username, email, and password
   - Submit the form

2. **Login**
   - Click "Login" button
   - Enter your username/email and password
   - You'll be redirected to the voting dashboard

3. **Cast Your Vote**
   - Browse active elections
   - View candidate information
   - Select a candidate by clicking the radio button
   - Click "Cast Your Vote"
   - Confirm your selection in the modal
   - ✅ Vote submitted!

### For Administrators

1. **Login as Admin**
   - Use admin credentials to login
   - You'll be redirected to the admin dashboard

2. **Create an Election**
   - Click "Create Election" button
   - Enter election title and description
   - Optionally check "Start election immediately"
   - Submit the form

3. **Add Candidates**
   - Click "Add Candidate" button
   - Select the election
   - Enter candidate name and description
   - Submit the form

4. **Start an Election**
   - Find the election in the list
   - Click "Start" button
   - Confirm the action

5. **View Results**
   - Click "Results" button on any election
   - View interactive bar chart
   - See detailed results table with rankings and percentages

## 🔧 Configuration

### API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register` | POST | User registration |
| `/api/login` | POST | User login |
| `/api/elections` | GET | Get active elections |
| `/api/elections/{id}/candidates` | GET | Get election candidates |
| `/api/vote` | POST | Cast a vote |
| `/api/admin/election` | POST | Create election (admin) |
| `/api/admin/candidate` | POST | Add candidate (admin) |
| `/api/admin/start/{id}` | POST | Start election (admin) |
| `/api/admin/results/{id}` | GET | Get election results (admin) |

### Customization

**Change Colors:**
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --success-color: #10b981;
    /* ... more variables */
}
```

**Adjust Animations:**
Modify transition speeds:
```css
:root {
    --transition-fast: 150ms ease-in-out;
    --transition-normal: 300ms ease-in-out;
}
```

## 🔐 Security Features

- **JWT Token Authentication** - Secure token-based auth
- **Local Storage** - Tokens stored securely in browser
- **XSS Prevention** - All user input is escaped
- **CORS Handling** - Proper cross-origin requests
- **One Vote Policy** - Backend validation prevents duplicate votes
- **Admin-Only Routes** - Protected admin endpoints

## 🎯 API Integration

The frontend communicates with your FastAPI backend using:

- **Fetch API** - Modern promise-based HTTP requests
- **Bearer Token Auth** - JWT tokens in Authorization header
- **Error Handling** - Comprehensive try-catch blocks
- **Loading States** - Visual feedback during API calls
- **Toast Notifications** - User-friendly success messages

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 🐛 Troubleshooting

### Backend Connection Issues

**Problem:** Can't connect to backend
**Solution:** 
1. Check if backend is running: `http://localhost:8000/docs`
2. Verify `BASE_URL` in `js/config.js`
3. Check browser console for CORS errors
4. Ensure backend CORS settings allow frontend origin

### Authentication Issues

**Problem:** Can't login after registration
**Solution:**
1. Check browser console for errors
2. Clear browser local storage
3. Verify credentials are correct
4. Check backend logs for errors

### Voting Issues

**Problem:** "Already voted" error
**Solution:**
- Each user can only vote once per election
- This is a backend validation
- Create a new user account to test

## 🚧 Known Limitations

1. **Backend Dependency** - Requires FastAPI backend to be running
2. **No Offline Mode** - Requires active internet connection
3. **Single Admin Creation** - Admins must be created via backend/database
4. **No Email Verification** - Email verification not implemented in frontend

## 🔮 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Election scheduling (start/end dates)
- [ ] Vote receipts and confirmations
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Export results to PDF/CSV
- [ ] Real-time vote count updates (WebSocket)
- [ ] Two-factor authentication

## 📊 Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables, grid, and flexbox
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Chart.js** - Data visualization
- **Font Awesome** - Icon library
- **Google Fonts** - Inter font family

## 🤝 Integration with Backend

This frontend is designed to work with the FastAPI backend you provided. Make sure:

1. Backend is running on the configured URL
2. CORS is enabled on the backend for your frontend origin
3. All endpoints match the expected format
4. JWT token format is compatible

### Backend CORS Configuration

Add to your FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For issues, questions, or contributions:
- Check the browser console for error messages
- Verify backend is running and accessible
- Ensure all API endpoints are working via `/docs`

## 🎉 Acknowledgments

- **Chart.js** - Beautiful charts
- **Font Awesome** - Comprehensive icons
- **Google Fonts** - Typography
- **FastAPI** - Backend framework

---

**Built with ❤️ for secure and transparent voting**
