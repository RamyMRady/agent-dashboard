const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 5002;

// Get live session status from OpenClaw
function getSessionStatus() {
    try {
        const result = execSync('openclaw sessions list --json 2>/dev/null', { 
            encoding: 'utf8',
            timeout: 5000 
        });
        return JSON.parse(result);
    } catch (e) {
        // Fallback: read from a status file or return mock data
        return { sessions: [], error: e.message };
    }
}

// Agent definitions
const AGENTS = {
    main: { name: 'MAGNAM', emoji: '⚡', role: 'Orchestrator', model: 'Opus 4.5' },
    dallas: { name: 'DALLAS', emoji: '🏙️', role: 'iProgramAI Lead', model: 'Sonnet 4' },
    seattle: { name: 'SEATTLE', emoji: '🌲', role: 'NetAgents Lead', model: 'Sonnet 4' },
    houston: { name: 'HOUSTON', emoji: '🚀', role: 'PharmaCRM Lead', model: 'Sonnet 4' },
    coder: { name: 'CODER', emoji: '💻', role: 'Development', model: 'Sonnet 4' },
    engineer: { name: 'ENGINEER', emoji: '🔧', role: 'Architecture', model: 'Sonnet 4' },
    researcher: { name: 'RESEARCHER', emoji: '🔬', role: 'Research', model: 'Sonnet 4' },
    writer: { name: 'WRITER', emoji: '✍️', role: 'Documentation', model: 'Sonnet 4' },
    analyst: { name: 'ANALYST', emoji: '📊', role: 'Analysis', model: 'Sonnet 4' },
    datascientist: { name: 'DATASCIENTIST', emoji: '🤖', role: 'ML/Data', model: 'Sonnet 4' },
    scientist: { name: 'SCIENTIST', emoji: '🧪', role: 'Science', model: 'Sonnet 4' },
    financial: { name: 'FINANCIAL', emoji: '💰', role: 'Finance', model: 'Sonnet 4' },
    lawyer: { name: 'LAWYER', emoji: '⚖️', role: 'Legal', model: 'Sonnet 4' },
    geek: { name: 'GEEK', emoji: '🎮', role: 'Tech/UI', model: 'Sonnet 4' },
    megaman: { name: 'MEGAMAN', emoji: '💪', role: 'Power Tasks', model: 'Sonnet 4' },
    flash: { name: 'FLASH', emoji: '⚡', role: 'Speed Tasks', model: 'Sonnet 4' },
    ihelp: { name: 'IHELP', emoji: '❓', role: 'Quick Help', model: 'Haiku 4.5' }
};

const server = http.createServer((req, res) => {
    if (req.url === '/api/status') {
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        
        // Build status from sessions
        const status = Object.entries(AGENTS).map(([id, agent]) => ({
            id,
            ...agent,
            status: 'idle',
            lastActivity: null,
            currentTask: null
        }));
        
        res.end(JSON.stringify({ agents: status, timestamp: Date.now() }));
    } else if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`🎨 Agent Dashboard running at http://127.0.0.1:${PORT}`);
});
