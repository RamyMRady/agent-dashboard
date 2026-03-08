import express from 'express';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5002;

// Status file path
const STATUS_FILE = join(__dirname, 'status.json');

// Initialize status file if it doesn't exist
if (!existsSync(STATUS_FILE)) {
    writeFileSync(STATUS_FILE, JSON.stringify({
        agents: [
            {
                id: 'magnam',
                name: 'MAGNAM',
                emoji: '⚡',
                model: 'Claude Opus 4.5',
                status: 'idle',
                currentTask: null,
                project: null,
                lastActivity: Date.now()
            }
        ],
        projects: [
            {
                id: 'agent-dashboard',
                name: 'Agent Dashboard',
                emoji: '📊',
                status: 'active',
                description: 'Real-time agent monitoring'
            },
            {
                id: 'iprogramai',
                name: 'iProgramAI',
                emoji: '🎓',
                status: 'live',
                description: 'AI learning platform'
            },
            {
                id: 'netagents',
                name: 'NetAgents',
                emoji: '🌐',
                status: 'development',
                description: 'Multi-agent workspace'
            },
            {
                id: 'pharmacrm',
                name: 'PharmaCRM',
                emoji: '💊',
                status: 'planning',
                description: 'Healthcare CRM'
            }
        ],
        activity: []
    }, null, 2));
}

// Serve static files
app.use(express.static(__dirname));

// CORS for local development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Get current status
app.get('/api/status', (req, res) => {
    try {
        const status = JSON.parse(readFileSync(STATUS_FILE, 'utf8'));
        res.json(status);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update agent status (called by MAGNAM)
app.post('/api/update', express.json(), (req, res) => {
    try {
        const status = JSON.parse(readFileSync(STATUS_FILE, 'utf8'));
        const { agentId, task, project, action } = req.body;
        
        const agent = status.agents.find(a => a.id === agentId);
        if (agent) {
            agent.status = action === 'complete' ? 'idle' : 'working';
            agent.currentTask = action === 'complete' ? null : task;
            agent.project = action === 'complete' ? null : project;
            agent.lastActivity = Date.now();
            
            // Add to activity log
            status.activity.unshift({
                agentId,
                task,
                project,
                action,
                timestamp: Date.now()
            });
            
            // Keep only last 50 activities
            status.activity = status.activity.slice(0, 50);
            
            writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
        }
        
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`📊 Agent Dashboard running at http://127.0.0.1:${PORT}`);
});
