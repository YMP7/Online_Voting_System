// API Configuration
const API_CONFIG = {
    // Change this to your backend URL
    BASE_URL: 'http://localhost:8000',
    
    // API Endpoints
    ENDPOINTS: {
        REGISTER: '/api/register',
        LOGIN: '/api/login',
        ELECTIONS: '/api/elections',
        VOTE: '/api/vote',
        ADMIN: {
            CREATE_ELECTION: '/api/admin/election',
            ADD_CANDIDATE: '/api/admin/candidate',
            START_ELECTION: '/api/admin/start',
            RESULTS: '/api/admin/results'
        }
    }
};

// Local Storage Keys
const STORAGE_KEYS = {
    TOKEN: 'voting_token',
    USER: 'voting_user',
    IS_ADMIN: 'voting_is_admin'
};

// Application State
const APP_STATE = {
    currentUser: null,
    isAdmin: false,
    token: null,
    elections: [],
    selectedElection: null,
    selectedCandidate: null
};
