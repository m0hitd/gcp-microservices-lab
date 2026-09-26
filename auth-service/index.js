const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  console.log('Health check received');
  res.json({ status: 'healthy', service: 'auth-service' });
});

// Generate token
app.post('/authenticate', (req, res) => {
  const token = Buffer.from(
    JSON.stringify({ 
      user: req.body.username || 'anonymous', 
      exp: Date.now() + 3600000,
      iat: Date.now()
    })
  ).toString('base64');
  
  console.log(`Token generated for user: ${req.body.username}`);
  res.json({ token, message: 'Authentication successful' });
});

// Verify token
app.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('Verification failed: No token provided');
    return res.status(401).json({ valid: false, message: 'No token' });
  }
  
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.exp > Date.now()) {
      console.log(`Token verified for user: ${decoded.user}`);
      res.json({ valid: true, user: decoded.user });
    } else {
      res.status(401).json({ valid: false, message: 'Token expired' });
    }
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
  console.log(`PID: ${process.pid}`);
});
