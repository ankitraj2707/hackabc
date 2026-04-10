/**
 * The City Pulse - Frontend Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener to the main scan button
    const scanButton = document.getElementById('initiateScanBtn');
    if (scanButton) {
        // We use a hardcoded startup ID '1' for the MVP demonstration
        scanButton.addEventListener('click', () => runOpportunityEngine(1));
    }
});

/**
 * Fetches matched government schemes from the backend API
 * @param {number} startupId - The ID of the startup in the database
 */
async function runOpportunityEngine(startupId) {
    const container = document.getElementById('resultsContainer');
    const loading = document.getElementById('loading');
    const button = document.getElementById('initiateScanBtn');
    
    // UI State: Loading
    container.innerHTML = ''; 
    loading.style.display = 'block';
    button.disabled = true;
    button.innerText = 'Scanning Grid...';

    try {
        // Call the Node.js API endpoint
        const response = await fetch(`http://localhost:3000/api/matches/${startupId}`);
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Artificial delay to simulate complex data crunching for better UX
        setTimeout(() => {
            loading.style.display = 'none';
            renderMatches(data.matches);
            
            // Update button UI
            button.innerText = `Re-Scan for ${data.startup.name}`;
            button.disabled = false;
        }, 1000);

    } catch (error) {
        // UI State: Error
        loading.style.display = 'none';
        button.disabled = false;
        button.innerText = 'Initiate DNA Scan';
        
        container.innerHTML = `
            <div style="text-align:center; padding: 20px; background: rgba(255, 107, 107, 0.1); border-radius: 12px; border: 1px solid rgba(255, 107, 107, 0.3);">
                <h3 style="color: #ff6b6b; margin-bottom: 10px;">Connection Failed</h3>
                <p style="font-size: 0.9rem; opacity: 0.8;">Unable to connect to The City Pulse core server. Ensure your Node.js backend is running on port 3000.</p>
            </div>
        `;
        console.error('Opportunity Engine Error:', error);
    }
}

/**
 * Dynamically builds HTML cards for each match and injects them into the DOM
 * @param {Array} matches - Array of matched scheme objects
 */
function renderMatches(matches) {
    const container = document.getElementById('resultsContainer');
    
    if (!matches || matches.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 30px; width: 100%;">
                <p style="opacity: 0.7;">No high-confidence matches found in the current infrastructure scan.</p>
            </div>
        `;
        return;
    }

    // Use a Document Fragment for better performance when appending multiple elements
    const fragment = document.createDocumentFragment();

    matches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        
        // Format the funding amount nicely (e.g., $50,000)
        const formattedAmount = Number(match.funding_amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });

        card.innerHTML = `
            <div class="match-score">${match.matchScore}% DNA Match</div>
            <h3 class="card-title">${match.title}</h3>
            <div class="funding-amount">Up to ${formattedAmount}</div>
            <div class="apply-link" onclick="triggerFrictionlessCompliance(${match.id})">One-Click Apply ➔</div>
        `;
        
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

/**
 * Stub function for the "Frictionless Compliance" feature
 */
function triggerFrictionlessCompliance(schemeId) {
    alert(`Initiating Auto-Fill sequence for Scheme ID: ${schemeId}.\n(This would trigger the Document Vault API to map startup data to the municipal PDF forms.)`);
}