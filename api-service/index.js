const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');

const app = express();
const pubsub = new PubSub();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  console.log('Health check received');
  res.json({ status: 'healthy', service: 'api-service' });
});

// Submit job to Pub/Sub
app.post('/submit-job', async (req, res) => {
  try {
    const { jobType, data } = req.body;
    
    if (!jobType || !data) {
      return res.status(400).json({ 
        error: 'Missing jobType or data' 
      });
    }

    const topic = pubsub.topic('job-queue');
    const jobId = Math.random().toString(36).substr(2, 9);
    
    const message = Buffer.from(JSON.stringify({
      jobId,
      jobType,
      data,
      timestamp: new Date().toISOString()
    }));

    const messageId = await topic.publish(message);
    
    console.log(`Job submitted: ${jobId} (Message ID: ${messageId})`);
    
    res.status(202).json({ 
      status: 'accepted',
      jobId,
      messageId,
      message: 'Job queued for processing'
    });
  } catch (error) {
    console.error('Error submitting job:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job status (mock)
app.get('/job/:jobId', (req, res) => {
  console.log(`Status check for job: ${req.params.jobId}`);
  res.json({ 
    jobId: req.params.jobId,
    status: 'processing',
    message: 'Job is being processed by worker'
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API service running on port ${PORT}`);
  console.log(`PID: ${process.pid}`);
});
