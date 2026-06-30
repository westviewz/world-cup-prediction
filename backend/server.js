const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// CORP same-origin prevents other pages from embedding your resources as subresources
// (Spectre-style side-channel attacks). API access is controlled separately by CORS above.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-origin' },
  referrerPolicy: { policy: 'no-referrer-when-downgrade' },
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    uptime: process.uptime()
  });
});

app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve frontend static files with cross-origin policy so Clarity-Bot can fetch CSS/JS for session replay
app.use(express.static(path.join(__dirname, '../frontend/dist'), {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Catch-all route to serve the React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
