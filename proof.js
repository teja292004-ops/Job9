// Job Notification Tracker - Proof & Submission Logic

const STORAGE_KEYS = {
    STEPS: 'jnt_steps',
    TESTS: 'jnt_tests',
    ARTIFACTS: 'jnt_artifacts',
    STATUS: 'jnt_status'
};

const STEP_NAMES = [
    'Project Setup',
    'Match Scoring Logic',
    'Daily Digest System',
    'Status Tracking',
    'UI/UX Design',
    'Testing Suite',
    'Deployment Setup',
    'Documentation'
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCompletionSummary();
    renderTestStatus();
    loadArtifacts();
    updateStatus();
    attachEventListeners();
});

function renderCompletionSummary() {
    const savedSteps = JSON.parse(localStorage.getItem(STORAGE_KEYS.STEPS) || '{}');
    const summaryContainer = document.getElementById('completionSummary');
    
    let html = '';
    for (let i = 1; i <= 8; i++) {
        const isCompleted = savedSteps[i] === true;
        const statusClass = isCompleted ? 'completed' : 'pending';
        const statusText = isCompleted ? 'Completed' : 'Pending';
        
        html += `
            <div class="summary-item">
                <span>Step ${i}: ${STEP_NAMES[i - 1]}</span>
                <span class="summary-status ${statusClass}">${statusText}</span>
            </div>
        `;
    }
    
    summaryContainer.innerHTML = html;
}

function renderTestStatus() {
    const savedTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS) || '{}');
    const testStatusContainer = document.getElementById('testStatus');
    
    let passedCount = 0;
    for (let i = 1; i <= 10; i++) {
        if (savedTests[i] === true) {
            passedCount++;
        }
    }
    
    testStatusContainer.innerHTML = `
        <div class="test-status-item">
            <span>Tests Passed</span>
            <span><strong>${passedCount} / 10</strong></span>
        </div>
        <div class="test-status-item">
            <span>Tests Remaining</span>
            <span><strong>${10 - passedCount}</strong></span>
        </div>
    `;
}

function loadArtifacts() {
    const savedArtifacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTIFACTS) || '{}');
    
    if (savedArtifacts.lovable) {
        document.getElementById('lovableLink').value = savedArtifacts.lovable;
    }
    if (savedArtifacts.github) {
        document.getElementById('githubLink').value = savedArtifacts.github;
    }
    if (savedArtifacts.deployed) {
        document.getElementById('deployedLink').value = savedArtifacts.deployed;
    }
}

function attachEventListeners() {
    const form = document.getElementById('artifactForm');
    form.addEventListener('submit', handleFormSubmit);
    
    const copyButton = document.getElementById('copySubmission');
    copyButton.addEventListener('click', handleCopySubmission);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const lovableLink = document.getElementById('lovableLink').value.trim();
    const githubLink = document.getElementById('githubLink').value.trim();
    const deployedLink = document.getElementById('deployedLink').value.trim();
    
    // Clear previous errors
    clearErrors();
    
    // Validate URLs
    let isValid = true;
    
    if (!isValidURL(lovableLink)) {
        showError('lovableError', 'Please enter a valid URL');
        isValid = false;
    }
    
    if (!isValidURL(githubLink)) {
        showError('githubError', 'Please enter a valid URL');
        isValid = false;
    }
    
    if (!isValidURL(deployedLink)) {
        showError('deployedError', 'Please enter a valid URL');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Save to localStorage
    const artifacts = {
        lovable: lovableLink,
        github: githubLink,
        deployed: deployedLink
    };
    
    localStorage.setItem(STORAGE_KEYS.ARTIFACTS, JSON.stringify(artifacts));
    
    // Update status
    updateStatus();
    
    // Show success message
    showSuccessMessage();
}

function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function clearErrors() {
    document.getElementById('lovableError').textContent = '';
    document.getElementById('githubError').textContent = '';
    document.getElementById('deployedError').textContent = '';
    
    document.getElementById('lovableLink').classList.remove('error');
    document.getElementById('githubLink').classList.remove('error');
    document.getElementById('deployedLink').classList.remove('error');
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
    const inputId = elementId.replace('Error', '');
    document.getElementById(inputId).classList.add('error');
}

function showSuccessMessage() {
    const messageDiv = document.getElementById('submissionMessage');
    messageDiv.textContent = 'Artifacts saved successfully!';
    messageDiv.className = 'submission-message success';
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'submission-message';
    }, 3000);
}

function updateStatus() {
    const artifacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTIFACTS) || '{}');
    const savedTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS) || '{}');
    
    // Check if all 3 links are provided
    const hasAllLinks = artifacts.lovable && artifacts.github && artifacts.deployed;
    
    // Check if all 10 tests passed
    let passedTests = 0;
    for (let i = 1; i <= 10; i++) {
        if (savedTests[i] === true) {
            passedTests++;
        }
    }
    const allTestsPassed = passedTests === 10;
    
    // Determine status
    let status = 'not-started';
    let statusText = 'Not Started';
    
    if (hasAllLinks || passedTests > 0) {
        status = 'in-progress';
        statusText = 'In Progress';
    }
    
    if (hasAllLinks && allTestsPassed) {
        status = 'shipped';
        statusText = 'Shipped';
    }
    
    // Update status badge
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = statusText;
    statusBadge.className = `status-badge ${status}`;
    
    // Enable/disable copy button
    const copyButton = document.getElementById('copySubmission');
    copyButton.disabled = !(hasAllLinks && allTestsPassed);
    
    // Show shipped message if applicable
    if (status === 'shipped') {
        showShippedMessage();
    }
    
    // Save status
    localStorage.setItem(STORAGE_KEYS.STATUS, status);
}

function showShippedMessage() {
    const messageDiv = document.getElementById('submissionMessage');
    if (messageDiv.textContent !== 'Project 1 Shipped Successfully.') {
        messageDiv.textContent = 'Project 1 Shipped Successfully.';
        messageDiv.className = 'submission-message success';
    }
}

function handleCopySubmission() {
    const artifacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTIFACTS) || '{}');
    
    const submissionText = `------------------------------------------
Job Notification Tracker — Final Submission

Lovable Project:
${artifacts.lovable}

GitHub Repository:
${artifacts.github}

Live Deployment:
${artifacts.deployed}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
------------------------------------------`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(submissionText).then(() => {
        const messageDiv = document.getElementById('submissionMessage');
        messageDiv.textContent = 'Submission copied to clipboard!';
        messageDiv.className = 'submission-message copied';
        
        setTimeout(() => {
            showShippedMessage();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}
