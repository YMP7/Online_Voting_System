// User Dashboard Functionality
const User = {
    elections: [],
    candidates: {},
    
    // Load active elections
    async loadElections() {
        try {
            showLoading();
            this.elections = await API.elections.getActive();
            
            if (this.elections.length === 0) {
                document.getElementById('noElectionsMessage').style.display = 'block';
                document.getElementById('electionsContainer').innerHTML = '';
            } else {
                document.getElementById('noElectionsMessage').style.display = 'none';
                
                // Load candidates for each election
                for (const election of this.elections) {
                    const candidates = await API.elections.getCandidates(election.id);
                    this.candidates[election.id] = candidates;
                }
                
                this.renderElections();
            }
            
            hideLoading();
        } catch (error) {
            hideLoading();
            console.error('Error loading elections:', error);
            showToast('Failed to load elections');
        }
    },
    
    // Render elections
    renderElections() {
        const container = document.getElementById('electionsContainer');
        container.innerHTML = '';
        
        this.elections.forEach(election => {
            const candidates = this.candidates[election.id] || [];
            const card = this.createElectionCard(election, candidates);
            container.appendChild(card);
        });
    },
    
    // Create election card
    createElectionCard(election, candidates) {
        const card = document.createElement('div');
        card.className = 'election-card';
        
        const candidatesHTML = candidates.map(candidate => `
            <div class="candidate-item">
                <div class="candidate-info">
                    <h5>${this.escapeHtml(candidate.name)}</h5>
                    ${candidate.description ? `<p>${this.escapeHtml(candidate.description)}</p>` : ''}
                </div>
                <input type="radio" name="election_${election.id}" value="${candidate.id}" class="vote-radio">
            </div>
        `).join('');
        
        card.innerHTML = `
            <div class="election-header">
                <h3>${this.escapeHtml(election.title)}</h3>
                <span class="status-badge ${election.is_active ? 'active' : 'inactive'}">
                    ${election.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>
            ${election.description ? `<p class="election-description">${this.escapeHtml(election.description)}</p>` : ''}
            <div class="election-meta">
                <span><i class="fas fa-calendar"></i> ${formatDate(election.created_at)}</span>
                <span><i class="fas fa-users"></i> ${candidates.length} Candidates</span>
            </div>
            <div class="candidates-list">
                <h4>Candidates:</h4>
                ${candidates.length > 0 ? candidatesHTML : '<p style="color: var(--text-secondary);">No candidates yet</p>'}
            </div>
            ${candidates.length > 0 ? `
                <div class="election-actions">
                    <button class="btn btn-success btn-block" onclick="User.handleVote(${election.id})">
                        <i class="fas fa-vote-yea"></i> Cast Your Vote
                    </button>
                </div>
            ` : ''}
        `;
        
        return card;
    },
    
    // Handle vote submission
    async handleVote(electionId) {
        const selectedRadio = document.querySelector(`input[name="election_${electionId}"]:checked`);
        
        if (!selectedRadio) {
            showToast('Please select a candidate');
            return;
        }
        
        const candidateId = parseInt(selectedRadio.value);
        const candidate = this.candidates[electionId].find(c => c.id === candidateId);
        const election = this.elections.find(e => e.id === electionId);
        
        // Store selection and show confirmation modal
        APP_STATE.selectedElection = election;
        APP_STATE.selectedCandidate = candidate;
        
        document.getElementById('confirmCandidateName').textContent = candidate.name;
        document.getElementById('confirmElectionName').textContent = `in ${election.title}`;
        
        Modal.show('voteConfirmModal');
    },
    
    // Confirm and submit vote
    async confirmVote() {
        const election = APP_STATE.selectedElection;
        const candidate = APP_STATE.selectedCandidate;
        
        if (!election || !candidate) {
            return;
        }
        
        try {
            showLoading();
            hideError('voteConfirmError');
            
            await API.elections.vote(election.id, candidate.id);
            
            hideLoading();
            Modal.hide('voteConfirmModal');
            showToast('Vote cast successfully!');
            
            // Reload elections to update UI
            setTimeout(() => {
                this.loadElections();
            }, 1000);
            
        } catch (error) {
            hideLoading();
            showError('voteConfirmError', error.message);
        }
    },
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
