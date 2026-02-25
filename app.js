// Job Notification Tracker - Main Dashboard Logic

const STORAGE_KEYS = {
    STEPS: 'jnt_steps',
    TESTS: 'jnt_tests'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStepStates();
    loadTestStates();
    attachEventListeners();
});

function loadStepStates() {
    const savedSteps = JSON.parse(localStorage.getItem(STORAGE_KEYS.STEPS) || '{}');
    
    document.querySelectorAll('.step-checkbox').forEach(checkbox => {
        const stepNum = checkbox.dataset.step;
        if (savedSteps[stepNum]) {
            checkbox.checked = true;
        }
    });
}

function loadTestStates() {
    const savedTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS) || '{}');
    
    document.querySelectorAll('.test-checkbox').forEach(checkbox => {
        const testNum = checkbox.dataset.test;
        if (savedTests[testNum]) {
            checkbox.checked = true;
        }
    });
}

function attachEventListeners() {
    // Step checkboxes
    document.querySelectorAll('.step-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            saveStepState(e.target.dataset.step, e.target.checked);
        });
    });

    // Test checkboxes
    document.querySelectorAll('.test-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            saveTestState(e.target.dataset.test, e.target.checked);
        });
    });
}

function saveStepState(stepNum, isChecked) {
    const savedSteps = JSON.parse(localStorage.getItem(STORAGE_KEYS.STEPS) || '{}');
    savedSteps[stepNum] = isChecked;
    localStorage.setItem(STORAGE_KEYS.STEPS, JSON.stringify(savedSteps));
}

function saveTestState(testNum, isChecked) {
    const savedTests = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTS) || '{}');
    savedTests[testNum] = isChecked;
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(savedTests));
}
