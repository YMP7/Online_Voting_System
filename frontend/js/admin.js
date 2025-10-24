// Admin Dashboard Functionality
const Admin = {
    elections: [],
    allCandidates: {},
    
    // Load admin dashboard
    async loadDashboard() {
        try {
            showLoading();
            await this.loadElections();
            hideLoading();
        } catch (error) {
            hideLoading();
            console.error('Error loading admin dashboard:', error);
            showToast('Failed to load dashboard data');
        }
    },
    
    // Load all elections
    async loadElections() {
        try {
            this.elections = await API.admin.getAllElections();
            
            // Load candidates for each election
            for (const election of this.elections) {
                const candidates = await API.elections.getCandidates(election.id);
                this.allCandidates[election.id] = candidates;
            }
            
            this.renderElections();
            this.populateElectionSelect();
        } catch (error) {
            console.error('Error loading elections:', error);
            throw error;
        }
    },
    
    // Render elections in admin view
    renderElections() {
        const container = document.getElementById('adminElectionsContainer');
        
        if (this.elections.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No Elections Yet</h3>
                    <p>Create your first election to get started</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '';
        
        this.elections.forEach(election => {
            const candidates = this.allCandidates[election.id] || [];
            const card = this.createAdminElectionCard(election, candidates);
            container.appendChild(card);
        });
    },
    
    // Create admin election card
    createAdminElectionCard(election, candidates) {
        const card = document.createElement('div');
        card.className = 'admin-election-card';
        
        const candidatesHTML = candidates.length > 0 
            ? candidates.map(c => `<li>${this.escapeHtml(c.name)}</li>`).join('')
            : '<li style="color: var(--text-secondary);">No candidates added yet</li>';
        
        card.innerHTML = `
            <div class="admin-election-header">
                <div class="admin-election-info">
                    <h3>${this.escapeHtml(election.title)}</h3>
                    ${election.description ? `<p>${this.escapeHtml(election.description)}</p>` : ''}
                    <div class="election-meta">
                        <span><i class="fas fa-calendar"></i> ${formatDate(election.created_at)}</span>
                        <span class="status-badge ${election.is_active ? 'active' : 'inactive'}">
                            ${election.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div class="admin-election-actions">
                    ${!election.is_active ? `
                        <button class="btn btn-success btn-sm" onclick="Admin.startElection(${election.id})">
                            <i class="fas fa-play"></i> Start
                        </button>
                    ` : ''}
                    <button class="btn btn-primary btn-sm" onclick="Admin.viewResults(${election.id})">
                        <i class="fas fa-chart-bar"></i> Results
                    </button>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <strong><i class="fas fa-users"></i> Candidates (${candidates.length}):</strong>
                <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                    ${candidatesHTML}
                </ul>
            </div>
        `;
        
        return card;
    },
    
    // Populate election select dropdown
    populateElectionSelect() {
        const select = document.getElementById('candidateElection');
        select.innerHTML = '<option value="">-- Select Election --</option>';
        
        this.elections.forEach(election => {
            const option = document.createElement('option');
            option.value = election.id;
            option.textContent = `${election.title} ${election.is_active ? '(Active)' : '(Inactive)'}`;
            select.appendChild(option);
        });
    },
    
    // Create new election
    async createElection(title, description, isActive) {
        try {
            showLoading();
            hideError('createElectionError');
            
            await API.admin.createElection(title, description, isActive);
            
            hideLoading();
            Modal.hide('createElectionModal');
            showToast('Election created successfully!');
            
            // Reload dashboard
            await this.loadDashboard();
            
        } catch (error) {
            hideLoading();
            showError('createElectionError', error.message);
        }
    },
    
    // Add candidate to election
    async addCandidate(electionId, name, description) {
        try {
            showLoading();
            hideError('addCandidateError');
            
            await API.admin.addCandidate(electionId, name, description);
            
            hideLoading();
            Modal.hide('addCandidateModal');
            showToast('Candidate added successfully!');
            
            // Reload dashboard
            await this.loadDashboard();
            
        } catch (error) {
            hideLoading();
            showError('addCandidateError', error.message);
        }
    },
    
    // Start election
    async startElection(electionId) {
        if (!confirm('Are you sure you want to start this election? Users will be able to vote once it starts.')) {
            return;
        }
        
        try {
            showLoading();
            await API.admin.startElection(electionId);
            hideLoading();
            
            showToast('Election started successfully!');
            
            // Reload dashboard
            await this.loadDashboard();
            
        } catch (error) {
            hideLoading();
            alert(`Failed to start election: ${error.message}`);
        }
    },
    
    // View election results
    async viewResults(electionId) {
        try {
            showLoading();
            const results = await API.admin.getResults(electionId);
            hideLoading();
            
            // Display results
            this.displayResults(results);
            Modal.show('resultsModal');
            
        } catch (error) {
            hideLoading();
            alert(`Failed to load results: ${error.message}`);
        }
    },
    
    // Display results with chart
    displayResults(results) {
        document.getElementById('resultsElectionTitle').textContent = results.election_title;
        document.getElementById('resultsTotalVotes').textContent = `Total Votes: ${results.total_votes}`;
        
        // Create chart
        const ctx = document.getElementById('resultsChart').getContext('2d');
        
        // Destroy existing chart if any
        if (window.resultsChartInstance) {
            window.resultsChartInstance.destroy();
        }
        
        const chartData = {
            labels: results.results.map(r => r.candidate_name),
            datasets: [{
                label: 'Votes',
                data: results.results.map(r => r.vote_count),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(59, 130, 246, 1)'
                ],
                borderWidth: 2
            }]
        };
        
        window.resultsChartInstance = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Vote Distribution',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
        
        // Create results table
        this.createResultsTable(results);
    },
    
    // Create results table
    createResultsTable(results) {
        const tableContainer = document.getElementById('resultsTable');
        
        const totalVotes = results.total_votes;
        
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Candidate</th>
                        <th>Votes</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Sort results by vote count
        const sortedResults = [...results.results].sort((a, b) => b.vote_count - a.vote_count);
        
        sortedResults.forEach((result, index) => {
            const percentage = totalVotes > 0 
                ? ((result.vote_count / totalVotes) * 100).toFixed(1)
                : '0.0';
            
            tableHTML += `
                <tr>
                    <td><strong>#${index + 1}</strong></td>
                    <td>${this.escapeHtml(result.candidate_name)}</td>
                    <td>${result.vote_count}</td>
                    <td><span class="results-percentage">${percentage}%</span></td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
    },
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
