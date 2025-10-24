// Authentication Management
const Auth = {
    // Check if user is logged in
    isAuthenticated() {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },
    
    // Get current user info
    getCurrentUser() {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },
    
    // Check if user is admin
    isAdmin() {
        return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
    },
    
    // Save authentication data
    saveAuth(token, username, isAdmin) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ username }));
        localStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdmin.toString());
        
        APP_STATE.token = token;
        APP_STATE.currentUser = username;
        APP_STATE.isAdmin = isAdmin;
    },
    
    // Clear authentication data
    clearAuth() {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
        
        APP_STATE.token = null;
        APP_STATE.currentUser = null;
        APP_STATE.isAdmin = false;
    },
    
    // Initialize auth state from storage
    init() {
        if (this.isAuthenticated()) {
            APP_STATE.token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            APP_STATE.currentUser = this.getCurrentUser()?.username;
            APP_STATE.isAdmin = this.isAdmin();
        }
    },
    
    // Handle login
    async login(usernameOrEmail, password) {
        try {
            showLoading();
            const response = await API.auth.login(usernameOrEmail, password);
            
            // Save auth data
            this.saveAuth(response.access_token, usernameOrEmail, response.is_admin);
            
            hideLoading();
            return { success: true, isAdmin: response.is_admin };
        } catch (error) {
            hideLoading();
            throw error;
        }
    },
    
    // Handle registration
    async register(username, email, password) {
        try {
            showLoading();
            const response = await API.auth.register(username, email, password);
            
            // Save auth data
            this.saveAuth(response.access_token, username, response.is_admin);
            
            hideLoading();
            return { success: true, isAdmin: response.is_admin };
        } catch (error) {
            hideLoading();
            throw error;
        }
    },
    
    // Handle logout
    logout() {
        this.clearAuth();
        UI.showLanding();
        showToast('Logged out successfully');
    }
};

// UI Management
const UI = {
    // Show landing page
    showLanding() {
        document.getElementById('landingPage').style.display = 'block';
        document.getElementById('userDashboard').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('navMenu').style.display = 'flex';
        document.getElementById('navUserMenu').style.display = 'none';
    },
    
    // Show user dashboard
    showUserDashboard() {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('userDashboard').style.display = 'block';
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('navMenu').style.display = 'none';
        document.getElementById('navUserMenu').style.display = 'flex';
        
        // Update greeting
        const user = Auth.getCurrentUser();
        document.getElementById('userGreeting').textContent = `Welcome, ${user.username}`;
    },
    
    // Show admin dashboard
    showAdminDashboard() {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('userDashboard').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        document.getElementById('navMenu').style.display = 'none';
        document.getElementById('navUserMenu').style.display = 'flex';
        
        // Update greeting
        const user = Auth.getCurrentUser();
        document.getElementById('userGreeting').textContent = `Admin: ${user.username}`;
    },
    
    // Initialize UI based on auth state
    init() {
        if (Auth.isAuthenticated()) {
            if (Auth.isAdmin()) {
                this.showAdminDashboard();
                Admin.loadDashboard();
            } else {
                this.showUserDashboard();
                User.loadElections();
            }
        } else {
            this.showLanding();
        }
    }
};

// Modal Management
const Modal = {
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    },
    
    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            
            // Clear any error messages
            const errorElements = modal.querySelectorAll('.error-message');
            errorElements.forEach(el => {
                el.style.display = 'none';
                el.textContent = '';
            });
            
            // Reset forms
            const forms = modal.querySelectorAll('form');
            forms.forEach(form => form.reset());
        }
    },
    
    hideAll() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = 'auto';
    }
};

// Utility Functions
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('successToast');
    const messageEl = document.getElementById('successToastMessage');
    
    messageEl.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
