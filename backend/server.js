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

// 1. Database Connection
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('railway');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: isProduction ? { rejectUnauthorized: false } : false 
});

pool.connect((err, client, release) => {
  if (err) return console.error('❌ Database connection failed:', err.stack);
  console.log('✅ Connected to Database successfully');
  release();
});

// 2. Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- AUTHENTICATION ROUTES ---

app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const result = await pool.query(
            // We use 'name' and 'full_name' to ensure both columns are populated
            'INSERT INTO users (name, full_name, email, password, role) VALUES ($1, $1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, password, role || 'seeker']
        );
        res.status(201).json({ message: "User created", user: result.rows[0] });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Registration failed" });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];

        // Check if the plain-text password matches
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ 
            message: "Login successful", 
            user: { id: user.id, name: user.name, role: user.role },
            token: "fake-jwt-token" 
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
});

// --- CONTACT FORM ROUTE ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
            [name, email, message]
        );
        
        console.log(`📬 New Message from ${name}:`, result.rows[0]);
        res.status(201).json({ message: "Message received successfully!" });
    } catch (err) {
        console.error("Contact Form Error:", err.message);
        res.status(500).json({ message: "Failed to send message" });
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
        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [parseInt(id)]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Job not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching job details" });
    }
});

// --- DASHBOARD & APPLICATIONS ---

app.get('/api/dashboard', async (req, res) => {
    const userId = req.headers['user-id']; 
    const role = req.headers['user-role'];

    if (!userId || !role) return res.status(401).json({ message: "Unauthorized" });

    try {
        if (role === 'seeker') {
            const query = `
                SELECT j.title as job_title, j.company, a.status, a.applied_at 
                FROM applications a
                JOIN jobs j ON a.job_id = j.id
                WHERE a.user_id = $1 ORDER BY a.applied_at DESC`;
            const result = await pool.query(query, [userId]);
            res.json({ role: "seeker", applications: result.rows });
        } else {
            const query = `
                SELECT j.id as job_id, j.title as job_title, a.id as app_id, u.name as candidate_name, u.email as candidate_email, a.status
                FROM jobs j
                LEFT JOIN applications a ON j.id = a.job_id
                LEFT JOIN users u ON a.user_id = u.id
                WHERE j.employer_id = $1 ORDER BY j.id DESC`;
            const result = await pool.query(query, [userId]);
            
            // Group data by Job ID
            const data = result.rows.reduce((acc, row) => {
                let job = acc.find(j => j.job_id === row.job_id);
                if (!job) {
                    job = { job_id: row.job_id, title: row.job_title, applicants: [] };
                    acc.push(job);
                }
                if (row.app_id) job.applicants.push({ id: row.app_id, name: row.candidate_name, email: row.candidate_email, status: row.status });
                return acc;
            }, []);
            res.json({ role: "employer", postings: data });
        }
    } catch (err) {
        res.status(500).json({ message: "Dashboard error" });
    }
});

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

// --- TESTIMONIALS ---

app.get('/api/testimonials', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.content, t.rating, u.name 
            FROM testimonials t 
            JOIN users u ON t.user_id = u.id 
            ORDER BY t.created_at DESC LIMIT 6`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching testimonials" });
    }
});

app.post('/api/testimonials', async (req, res) => {
    const { userId, content, rating } = req.body;
    try {
        await pool.query(
            'INSERT INTO testimonials (user_id, content, rating) VALUES ($1, $2, $3)',
            [userId, content, rating]
        );
        res.status(201).json({ message: "Testimonial saved" });
    } catch (err) {
        res.status(500).json({ message: "Error saving testimonial" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend active on port ${PORT}`));