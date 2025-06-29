const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();

// Get app name and set internal port (Docker Compose maps externally)
const replicaApp = process.env.APP_NAME || 'default-app';
const PORT = 3000;

// Middleware
app.use(morgan('combined'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to my GitLab CI/CD deployed application!',
    app: replicaApp,
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  const acceptHeader = req.get('accept') || '';
  
  if (acceptHeader.includes('application/json')) {
    return res.json({
      message: 'Welcome to my GitLab CI/CD deployed application!',
      app: replicaApp,
      status: 'running',
      timestamp: new Date().toISOString()
    });
  }

  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`${replicaApp} is running on port ${PORT}`);
});

module.exports = app;
