const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');
const { Logging } = require('@google-cloud/logging');

const app = express();
const pubsub = new PubSub();
const logging = new Logging();
const log = logging.log('worker-service');

const TOPIC = 'job-queue';
const SUBSCRIPTION = 'job-queue-sub';

// Health check endpoint (required for Cloud Run)
app.get('/health', (req, res) => {
  console.log('Health check received');
  res.json({ status: 'healthy', service: 'worker-service' });
});

async function subscribeToJobs() {
  console.log(`Subscribing to ${SUBSCRIPTION}...`);
  
  const subscription = pubsub.subscription(SUBSCRIPTION);
  
  subscription.on('message', async (message) => {
    try {
      const jobData = JSON.parse(message.data.toString());
      const { jobId, jobType, data } = jobData;
      
      console.log(`Processing job: ${jobId} (type: ${jobType})`);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Job ${jobId} completed successfully`);
      
      // Log to Cloud Logging
      const entry = log.entry(
        { severity: 'INFO' },
        `Job processed: ${jobId} - Type: ${jobType}`
      );
      await log.write(entry);
      
      message.ack();
    } catch (error) {
      console.error('Error processing job:', error);
      message.nack();
    }
  });

  subscription.on('error', (err) => {
    console.error('Subscription error:', err);
  });

  console.log('Worker service started. Waiting for jobs...');
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Worker service listening on port ${PORT}`);
});

subscribeToJobs().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
