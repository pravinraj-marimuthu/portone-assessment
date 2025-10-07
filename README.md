# Project Explanation

This project demonstrates a fully local, reproducible monitoring and logging stack for a containerized Node.js application. It integrates:

- **Application Containerization:** Node.js API containerized with Docker.
- **Logging Stack (ELK):** Filebeat ships app logs to Elasticsearch, visible in Kibana.
- **Monitoring Stack (Prometheus & Grafana):** App exposes metrics via `/metrics` endpoint, visualized in Grafana.
- **Easy Deployment:** All components run locally via Docker Compose with one command.

---

# Project Setup

## Prerequisites

- Docker & Docker Compose installed locally
- Node.js 18+ (optional, for local testing)
- 2 GB RAM minimum

## Directory Structure

```
project-root/
│
├─ app/                     # Node.js application source code
├─ logs/                    # App logs (mounted for Filebeat)
├─ grafana/
│  ├─ dashboards/           # Grafana dashboard files
│  └─ provisioning/         # Datasource & dashboard configs
├─ filebeat.yml             # Filebeat configuration
├─ docker-compose.yml       # Full stack orchestration
└─ start.sh                 # Script to start the full stack
```

---

# Quick Start

Run the stack with a single command:

```sh
chmod +x start.sh
./start.sh
```

The script will:

- Start all containers via Docker Compose
- Wait 10 seconds for services to initialize
- Display container status and access URLs

---

# Implementation

## 1. Application

- **Node.js + Express API**
- **Endpoints:**
    - `/` → root endpoint
    - `/health` → health check
    - `/slow` → simulates latency for histogram
    - `/metrics` → Prometheus metrics
- Metrics exposed using `prom-client`

## 2. Filebeat

- Watches `/logs/app.log`
- Ships logs to Elasticsearch

## 3. Prometheus & Grafana

- **Prometheus:** scrapes `/metrics` from app
- **Grafana dashboards** visualize:
    - Total HTTP requests
    - Request durations (histogram)

---

# Project Proof

Start the stack:

```sh
./start.sh
```

Trigger some app endpoints:

```sh
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/slow
```

- **Check logs in Kibana:**  
    Open [http://localhost:5601](http://localhost:5601)  
    Discover → `filebeat-*` index  
    You should see plain text logs.

- **Check metrics in Prometheus:**  
    Open [http://localhost:9090/targets](http://localhost:9090/targets)  
    Verify app endpoint is UP  
    Run a test query: `http_requests_total`

- **Check dashboards in Grafana:**  
    Open [http://localhost:3001](http://localhost:3001)  
    Login: `admin` / `admin`  
    Data source: Prometheus  
    Panels display request metrics.

---

# Stop the Stack

```sh
docker-compose down
```

---

# Conclusion

This project demonstrates a complete, reproducible DevOps stack:

- Containerized Node.js app
- ELK for logging
- Prometheus + Grafana for monitoring

Everything runs locally with a single command and can be verified easily, making it ideal for evaluation or demonstration purposes.