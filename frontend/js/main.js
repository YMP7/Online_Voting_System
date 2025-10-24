// Main Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication state
    Auth.init();
    
    // Initialize UI
    UI.init();
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Login/Register button handlers
    document.getElementById('loginBtn').addEventListener('click', () => {
        Modal.show('loginModal');
    });
    
    document.getElementById('registerBtn').addEventListener('click', () => {
        Modal.show('registerModal');
    });
    
    document.getElementById('heroLoginBtn').addEventListener('click', () => {
        Modal.show('loginModal');
    });
    
    document.getElementById('heroRegisterBtn').addEventListener('click', () => {
        Modal.show('registerModal');
    });
    
    // Switch between login and register
    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        Modal.hide('loginModal');
        Modal.show('registerModal');
    });
    
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        Modal.hide('registerModal');
        Modal.show('loginModal');
    });
    
    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        hideError('loginError');
        
        try {
            const result = await Auth.login(username, password);
            
            Modal.hide('loginModal');
            showToast('Login successful!');
            
            // Navigate to appropriate dashboard
            if (result.isAdmin) {
                UI.showAdminDashboard();
                Admin.loadDashboard();
            } else {
                UI.showUserDashboard();
                User.loadElections();
            }
            
        } catch (error) {
            showError('loginError', error.message || 'Login failed. Please check your credentials.');
        }
    });
    
    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        hideError('registerError');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showError('registerError', 'Passwords do not match');
            return;
        }
        
        try {
            const result = await Auth.register(username, email, password);
            
            Modal.hide('registerModal');
            showToast('Registration successful!');
            
            // Navigate to appropriate dashboard
            if (result.isAdmin) {
                UI.showAdminDashboard();
                Admin.loadDashboard();
            } else {
                UI.showUserDashboard();
                User.loadElections();
            }
            
        } catch (error) {
            showError('registerError', error.message || 'Registration failed. Please try again.');
        }
    });
    
    // Admin: Create Election button
    const createElectionBtn = document.getElementById('createElectionBtn');
    if (createElectionBtn) {
        createElectionBtn.addEventListener('click', () => {
            Modal.show('createElectionModal');
        });
    }
    
    // Admin: Add Candidate button
    const addCandidateBtn = document.getElementById('addCandidateBtn');
    if (addCandidateBtn) {
        addCandidateBtn.addEventListener('click', () => {
            Modal.show('addCandidateModal');
        });
    }
    
    // Admin: Create Election form submission
    document.getElementById('createElectionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('electionTitle').value.trim();
        const description = document.getElementById('electionDescription').value.trim();
        const isActive = document.getElementById('electionActive').checked;
        
        await Admin.createElection(title, description, isActive);
    });
    
    // Admin: Add Candidate form submission
    document.getElementById('addCandidateForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const electionId = parseInt(document.getElementById('candidateElection').value);
        const name = document.getElementById('candidateName').value.trim();
        const description = document.getElementById('candidateDescription').value.trim();
        
        if (!electionId) {
            showError('addCandidateError', 'Please select an election');
            return;
        }
        
        await Admin.addCandidate(electionId, name, description);
    });
    
    // User: Confirm vote button
    document.getElementById('confirmVoteBtn').addEventListener('click', () => {
        User.confirmVote();
    });
    
    // Close modal handlers
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            Modal.hide(modalId);
        });
    });
    
    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                Modal.hide(modal.id);
            }
        });
    });
    
    // Prevent modal close on content click
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// Make functions globally available for inline onclick handlers
window.User = User;
window.Admin = Admin;
window.Modal = Modal;
