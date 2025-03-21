const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost/qleen', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Job Schema
const jobSchema = new mongoose.Schema({
    carMake: String,
    service: String,
    location: String,
    timestamp: { type: Date, default: Date.now }
});
const Job = mongoose.model('Job', jobSchema);

// Detailer Schema
const detailerSchema = new mongoose.Schema({
    username: String,
    password: String // In production, hash this with bcrypt
});
const Detailer = mongoose.model('Detailer', detailerSchema);

// Middleware to Verify Token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// API Routes
app.post('/api/jobs', async (req, res) => {
    const { carMake, service, location } = req.body;
    const job = new Job({ carMake, service, location });
    await job.save();
    res.status(201).send('Job submitted');
});

app.get('/api/jobs', authenticateToken, async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const detailer = await Detailer.findOne({ username, password }); // Plain text for simplicity; use bcrypt in prod
    if (!detailer) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
});

// Seed a Detailer (Run once manually)
async function seedDetailer() {
    const exists = await Detailer.findOne({ username: 'detailer1' });
    if (!exists) {
        await new Detailer({ username: 'detailer1', password: 'password123' }).save();
        console.log('Detailer seeded');
    }
}
seedDetailer();

app.listen(3000, () => console.log('Server running on http://localhost:3000'));