// API Service Layer
const API = {
    // Make authenticated request
    async request(endpoint, options = {}) {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        
        const defaultHeaders = {
            'Content-Type': 'application/json'
        };
        
        if (token && options.requiresAuth !== false) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);
            
            // Handle different response types
            if (response.status === 204) {
                return { success: true };
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Authentication APIs
    auth: {
        async register(username, email, password) {
            return await API.request(API_CONFIG.ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                requiresAuth: false
            });
        },
        
        async login(usernameOrEmail, password) {
            const loginData = {
                password
            };
            
            // Determine if input is email or username
            if (usernameOrEmail.includes('@')) {
                loginData.email = usernameOrEmail;
            } else {
                loginData.username = usernameOrEmail;
            }
            
            return await API.request(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify(loginData),
                requiresAuth: false
            });
        }
    },
    
    // Election APIs
    elections: {
        async getActive() {
            return await API.request(API_CONFIG.ENDPOINTS.ELECTIONS);
        },
        
        async getCandidates(electionId) {
            return await API.request(`${API_CONFIG.ENDPOINTS.ELECTIONS}/${electionId}/candidates`);
        },
        
        async vote(electionId, candidateId) {
            return await API.request(API_CONFIG.ENDPOINTS.VOTE, {
                method: 'POST',
                body: JSON.stringify({
                    election_id: electionId,
                    candidate_id: candidateId
                })
            });
        }
    },
    
    // Admin APIs
    admin: {
        async createElection(title, description, isActive) {
            return await API.request(API_CONFIG.ENDPOINTS.ADMIN.CREATE_ELECTION, {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    description,
                    is_active: isActive
                })
            });
        },
        
        async addCandidate(electionId, name, description) {
            return await API.request(API_CONFIG.ENDPOINTS.ADMIN.ADD_CANDIDATE, {
                method: 'POST',
                body: JSON.stringify({
                    election_id: electionId,
                    name,
                    description
                })
            });
        },
        
        async startElection(electionId) {
            return await API.request(`${API_CONFIG.ENDPOINTS.ADMIN.START_ELECTION}/${electionId}`, {
                method: 'POST'
            });
        },
        
        async getResults(electionId) {
            return await API.request(`${API_CONFIG.ENDPOINTS.ADMIN.RESULTS}/${electionId}`);
        },
        
        // Get all elections (active and inactive)
        async getAllElections() {
            // Since backend only has endpoint for active elections,
            // we'll reuse it. In production, you might want a separate endpoint
            return await API.request(API_CONFIG.ENDPOINTS.ELECTIONS);
        }
    }
};
