# GCP Multi-Service Architecture Lab

Production-grade microservices deployment on Google Cloud Platform.

## Architecture

- **Auth Service** — Token generation & verification
- **API Service** — Job submission, Pub/Sub publishing
- **Worker Service** — Async job processing from Pub/Sub
- **API Gateway** — Single entry point, rate limiting, routing
- **VPC & IAM** — Network isolation, least-privilege service accounts
- **Cloud Logging** — Centralized observability

## Services

| Service | Language | Role |
|---------|----------|------|
| auth-service | Node.js | Authentication |
| api-service | Node.js | REST API, Pub/Sub publisher |
| worker-service | Node.js | Background job processor |

## Key Learnings

✅ Service Accounts — Fine-grained IAM  
✅ VPC & NAT — Network isolation  
✅ Cloud Run — Serverless compute  
✅ Pub/Sub — Async messaging  
✅ API Gateway — Single entry point  
✅ Cloud Logging — Observability  

## Cost

- Cloud Run: Free tier (2M invocations/month)
- Pub/Sub: Free tier (10GB/month)
- **Total: < $1**
