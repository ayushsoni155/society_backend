const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/authRoutes')
const familyRoutes = require('./routes/familyRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const queryRoutes = require('./routes/queryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const memberRoutes = require('./routes/memberRoutes');
//const documentRoutes = require('./routes/documentRoutes');
// Load environment variables
dotenv.config();

const app = express();

// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies/auth headers if needed
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => res.send('API is running...'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/queries', queryRoutes);
//app.use('/api/document', documentRoutes)

// Error handling middleware for CORS and other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation',Courthouse });
  }
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Sync DB and start server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to sync database:', err);
});