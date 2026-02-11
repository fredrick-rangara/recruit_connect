const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 1. Database Connection (Hybrid Logic)
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('railway');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: isProduction ? { rejectUnauthorized: false } : false 
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) return console.error('❌ Database connection failed:', err.stack);
  console.log('✅ Connected to Database successfully');
  release();
});

// 2. Multer Storage (CV Uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- AUTHENTICATION ROUTES ---

// 1. SIGNUP
app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, password, role || 'seeker']
        );

        res.status(201).json({ message: "User created", user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Registration failed" });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];

        // Simple password check (In production, use bcrypt.compare!)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Send back user info (and a token if you're using JWT)
        res.json({ 
            message: "Login successful", 
            user: { id: user.id, name: user.name, role: user.role },
            token: "fake-jwt-token-for-now" 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Login failed" });
    }
});

// --- JOB ROUTES ---

app.get('/api/jobs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching jobs" });
    }
});

app.get('/api/jobs/:id', async (req, res) => {
    try {
        let { id } = req.params;
        if (typeof id === 'string' && id.includes(':')) id = id.split(':').pop(); 
        const jobId = parseInt(id);
        
        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Job not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching job details" });
    }
});

// --- APPLICATION ROUTES ---

app.post('/api/apply', async (req, res) => {
    const { jobId, userId } = req.body; 
    try {
        await pool.query(
            'INSERT INTO applications (user_id, job_id, status, applied_at) VALUES ($1, $2, $3, NOW())',
            [userId, jobId, 'Pending']
        );
        res.status(201).json({ message: "Application successful!" });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ message: "Already applied!" });
        res.status(500).json({ message: "Server error" });
    }
});

// ... Keep your Employer Pipeline and Health Check routes here ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend active on port ${PORT}`));