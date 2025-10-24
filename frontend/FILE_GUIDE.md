# 📁 File Guide - SecureVote Frontend

Quick reference for what each file does and when to edit it.

## 🎯 Quick Navigation

- [HTML Files](#html-files)
- [CSS Files](#css-files)
- [JavaScript Files](#javascript-files)
- [Documentation Files](#documentation-files)

---

## HTML Files

### `index.html` (17KB)
**Purpose:** Main application file containing all HTML structure

**Contains:**
- Navigation bar
- Landing page with hero section
- Login/Register modals
- User dashboard (elections display)
- Admin dashboard (management interface)
- Vote confirmation modal
- Results modal with chart
- All modals and dialogs

**Edit when:**
- Adding new UI components
- Changing page structure
- Adding new modals
- Modifying forms

**Don't edit:**
- JavaScript event handlers (edit js/main.js instead)
- Styles (edit css/style.css instead)

---

## CSS Files

### `css/style.css` (20KB)
**Purpose:** Complete styling for the entire application

**Contains:**
- CSS variables (colors, spacing, etc.)
- Navigation bar styles
- Landing page styles
- Modal styles
- Form styles
- Dashboard styles
- Button styles
- Responsive breakpoints
- Animations

**Edit when:**
- Changing colors
- Adjusting spacing
- Modifying animations
- Adding new styles
- Customizing appearance

**CSS Variable Reference:**
```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --secondary-color: #8b5cf6;   /* Secondary accent */
    --success-color: #10b981;     /* Success messages */
    --warning-color: #f59e0b;     /* Warnings */
    --danger-color: #ef4444;      /* Errors */
}
```

---

## JavaScript Files

### `js/config.js` (833B)
**Purpose:** Configuration and constants

**Contains:**
- API base URL
- API endpoint paths
- Local storage keys
- Application state object

**Edit when:**
- Changing backend URL
- Adding new endpoints
- Modifying storage keys

**Important:**
```javascript
BASE_URL: 'http://localhost:8000'  // Change this for production!
```

---

### `js/api.js` (4.2KB)
**Purpose:** API service layer - handles all backend communication

**Contains:**
- Generic request function
- Authentication APIs (login, register)
- Election APIs (get elections, candidates)
- Voting API
- Admin APIs (create, add, start, results)

**Edit when:**
- Adding new API endpoints
- Modifying request handling
- Changing error handling
- Adding new API methods

**Example:**
```javascript
API.elections.getActive()    // Get active elections
API.admin.createElection()   // Create election (admin)
```

---

### `js/auth.js` (7KB)
**Purpose:** Authentication and UI management

**Contains:**
- Auth functions (login, logout, register)
- UI management (show/hide pages)
- Modal management
- Utility functions (loading, toast, errors)

**Edit when:**
- Changing auth flow
- Adding new pages/views
- Modifying modal behavior
- Adding utility functions

**Key Functions:**
```javascript
Auth.login()              // Handle login
Auth.logout()             // Handle logout
UI.showUserDashboard()    // Show user view
UI.showAdminDashboard()   // Show admin view
Modal.show('modalId')     // Open modal
showToast('message')      // Show notification
```

---

### `js/user.js` (5.5KB)
**Purpose:** User dashboard functionality

**Contains:**
- Load elections
- Display elections
- Handle voting
- Confirm vote submission

**Edit when:**
- Modifying election display
- Changing voting flow
- Adding user features
- Customizing candidate view

**Key Functions:**
```javascript
User.loadElections()      // Fetch and display elections
User.handleVote()         // Initiate voting
User.confirmVote()        // Submit vote
```

---

### `js/admin.js` (11KB)
**Purpose:** Admin dashboard functionality

**Contains:**
- Load admin data
- Create elections
- Add candidates
- Start elections
- View results with Chart.js
- Display results table

**Edit when:**
- Adding admin features
- Modifying election management
- Changing results display
- Customizing charts

**Key Functions:**
```javascript
Admin.loadDashboard()     // Load admin view
Admin.createElection()    // Create election
Admin.addCandidate()      // Add candidate
Admin.startElection()     // Activate election
Admin.viewResults()       // Show results with chart
```

---

### `js/main.js` (6.4KB)
**Purpose:** Application initialization and event handling

**Contains:**
- DOMContentLoaded initialization
- All event listeners
- Form submission handlers
- Button click handlers

**Edit when:**
- Adding new event listeners
- Changing initialization logic
- Adding new button handlers
- Modifying form handlers

**Event Setup:**
```javascript
setupEventListeners()     // Attaches all event handlers
```

---

## Documentation Files

### `README.md` (9KB)
**Purpose:** Main project documentation

**Contains:**
- Project overview
- Features list
- Installation instructions
- Usage guide
- Configuration
- Troubleshooting

**Edit when:**
- Updating features
- Changing setup process
- Adding new sections
- Fixing documentation

---

### `QUICKSTART.md` (2KB)
**Purpose:** Fast 5-minute setup guide

**Contains:**
- Minimal setup steps
- Quick start commands
- First-time usage
- Basic troubleshooting

**Edit when:**
- Simplifying setup
- Updating commands
- Changing ports

---

### `SETUP_GUIDE.md` (7.4KB)
**Purpose:** Detailed setup instructions

**Contains:**
- Prerequisites
- Backend setup
- Frontend setup
- Testing procedures
- Troubleshooting guide

**Edit when:**
- Adding setup steps
- Updating requirements
- Adding test cases

---

### `API_REFERENCE.md` (10KB)
**Purpose:** Complete API documentation

**Contains:**
- All endpoint details
- Request/response examples
- Authentication flow
- Error codes
- Testing with curl

**Edit when:**
- Adding new endpoints
- Changing request format
- Updating examples

---

### `FEATURES.md` (10KB)
**Purpose:** Feature showcase

**Contains:**
- UI features
- User features
- Admin features
- Technical features
- Design details

**Edit when:**
- Adding new features
- Updating capabilities
- Changing design

---

### `PROJECT_SUMMARY.md` (10KB)
**Purpose:** High-level project overview

**Contains:**
- Deliverables list
- Architecture overview
- Technologies used
- Project statistics

**Edit when:**
- Major changes
- New files added
- Technology updates

---

### `FILE_GUIDE.md` (This file)
**Purpose:** File reference guide

**Edit when:**
- Adding new files
- Changing file purposes

---

## 🔧 Configuration Files

### `.gitignore` (138B)
**Purpose:** Git ignore patterns

**Contains:**
- node_modules/
- IDE files
- OS files
- Environment files

**Edit when:**
- Adding new ignore patterns
- Excluding new files

---

## 📊 File Dependencies

```
index.html
    ↓
    ├── css/style.css
    └── js/
        ├── config.js (loaded first)
        ├── api.js (uses config.js)
        ├── auth.js (uses api.js)
        ├── user.js (uses api.js, auth.js)
        ├── admin.js (uses api.js, auth.js)
        └── main.js (uses all above)
```

**Load Order (Important!):**
1. config.js - Configuration
2. api.js - API layer
3. auth.js - Authentication
4. user.js - User features
5. admin.js - Admin features
6. main.js - Initialization

---

## 🎯 Common Editing Tasks

### Change Colors
**File:** `css/style.css`
**Section:** `:root` CSS variables
```css
--primary-color: #YOUR_COLOR;
```

### Change Backend URL
**File:** `js/config.js`
**Line:** `BASE_URL: 'http://localhost:8000'`

### Add New Modal
1. **File:** `index.html` - Add modal HTML
2. **File:** `css/style.css` - Add modal styles (if needed)
3. **File:** `js/main.js` - Add event listeners

### Add New API Endpoint
1. **File:** `js/config.js` - Add endpoint path
2. **File:** `js/api.js` - Add API function
3. **File:** `js/user.js` or `js/admin.js` - Use new function

### Modify Voting Flow
**Files:** `js/user.js`, `index.html`
**Functions:** `handleVote()`, `confirmVote()`

### Customize Results Display
**Files:** `js/admin.js`, `index.html`
**Functions:** `displayResults()`, `createResultsTable()`

---

## 📝 Code Style Guidelines

### JavaScript
- Use `async/await` for promises
- Use `const` for constants, `let` for variables
- Add JSDoc comments for functions
- Handle errors with try/catch
- Escape HTML to prevent XSS

### CSS
- Use CSS variables for theming
- Mobile-first responsive design
- BEM-like naming for classes
- Group related styles together

### HTML
- Semantic HTML5 elements
- ARIA labels for accessibility
- Consistent indentation
- Meaningful IDs and classes

---

## 🐛 Debugging Tips

### Frontend Issues
1. Check browser console (F12)
2. Look for JavaScript errors
3. Check Network tab for API calls
4. Verify localStorage has token

### API Issues
1. Check backend logs
2. Test endpoint at `/docs`
3. Verify CORS is enabled
4. Check token is valid

### Styling Issues
1. Check CSS is loaded
2. Inspect element (F12)
3. Verify class names
4. Check responsive breakpoints

---

## 🎯 File Size Reference

| File | Size | Purpose |
|------|------|---------|
| index.html | 17KB | Main HTML |
| css/style.css | 20KB | All styles |
| js/config.js | 833B | Configuration |
| js/api.js | 4.2KB | API layer |
| js/auth.js | 7KB | Authentication |
| js/user.js | 5.5KB | User features |
| js/admin.js | 11KB | Admin features |
| js/main.js | 6.4KB | Initialization |

**Total Code:** ~55KB (unminified)
**Minified:** ~25KB (estimated)

---

## ✅ Quick Checklist

Before deploying:
- [ ] Update `BASE_URL` in config.js
- [ ] Test all user flows
- [ ] Test all admin flows
- [ ] Verify responsive design
- [ ] Check CORS configuration
- [ ] Create admin user
- [ ] Test on multiple browsers
- [ ] Review documentation

---

**Happy Coding! 💻**
