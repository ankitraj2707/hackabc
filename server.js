const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. SYSTEM CONFIGURATION
// ==========================================

// Configure Express to use EJS for Server-Side Rendering (SSR)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// 2. DATABASE ARCHITECTURE
// ==========================================

// Establish connection to MySQL
// IMPORTANT: Update 'user' and 'password' to match your local MySQL credentials
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',         // <-- Replace with '12345' if you created that user, otherwise use 'root'
    password: '12345', // <-- Replace with your actual MySQL password
    database: 'city_pulse_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// 3. THE OPPORTUNITY ENGINE (LOGIC LAYER)
// ==========================================

/**
 * Calculates compatibility based on Startup DNA vs. Scheme Criteria
 * @param {Object} startup - The startup's database record
 * @param {Object} scheme - The government scheme database record
 * @returns {Number} - A match score out of 99
 */
const calculateMatchScore = (startup, scheme) => {
    let score = 0;
    
    // Parse the JSON criteria stored in the database
    const criteria = JSON.parse(scheme.criteria_json);
    
    // Core DNA Matching Logic
    if (startup.sector === criteria.targetSector) score += 40;
    if (startup.stage === criteria.targetStage) score += 30;
    
    // MVP Variance: Simulating complex factors like location mapping and founder demographics
    const variance = Math.floor(Math.random() * 20); 
    score += variance;
    
    // Cap score at 99% for realism (100% matches are rare)
    return Math.min(score, 99); 
};

// ==========================================
// 4. ROUTING & RENDERING
// ==========================================

/**
 * Main Application Route
 * Access via: http://localhost:3000/dashboard/1
 */
app.get('/dashboard/:startupId', async (req, res) => {
    try {
        const startupId = req.params.startupId;

        // Step A: Fetch Startup DNA from Database
        const [startupRows] = await pool.query('SELECT * FROM Startups WHERE id = ?', [startupId]);
        
        // Handle case where startup doesn't exist
        if (startupRows.length === 0) {
            return res.status(404).send(`
                <body style="background-color: #0f2027; display: flex; justify-content: center; align-items: center; height: 100vh;">
                    <h1 style="color: #ff6b6b; font-family: sans-serif; text-align: center;">
                        Startup ID ${startupId} not found in the infrastructure grid.
                    </h1>
                </body>
            `);
        }
        
        const startupDNA = startupRows[0];

        // Step B: Fetch all available government opportunities
        const [schemes] = await pool.query('SELECT * FROM Government_Schemes');

        // Step C: Process matches through the Opportunity Engine
        const recommendations = schemes.map(scheme => ({
            id: scheme.id,
            title: scheme.title,
            funding_amount: scheme.funding_amount,
            matchScore: calculateMatchScore(startupDNA, scheme)
        }))
        .filter(match => match.matchScore >= 40) // Only show high-confidence matches (40% or higher)
        .sort((a, b) => b.matchScore - a.matchScore); // Sort highest score first

        // Step D: Render the EJS view and inject the processed data directly into the HTML
        res.render('index', { 
            startup: startupDNA, 
            matches: recommendations 
        });

    } catch (error) {
        console.error("System Architecture Error:", error);
        res.status(500).send(`
            <body style="background-color: #0f2027; color: white; font-family: sans-serif; padding: 50px;">
                <h2 style="color: #ff6b6b;">Critical System Failure</h2>
                <p>Failed to connect to The City Pulse database.</p>
                <p style="opacity: 0.7;">Check your MySQL credentials in server.js and ensure your database is running.</p>
            </body>
        `);
    }
});

// ==========================================
// 5. SERVER INITIALIZATION
// ==========================================

app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 THE CITY PULSE ENGINE IS ONLINE`);
    console.log(`===================================================`);
    console.log(`Test the connection by opening your browser to:`);
    console.log(`http://localhost:${PORT}/dashboard/1`);
    console.log(`===================================================`);
});