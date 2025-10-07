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

# Quick start

Run the stack with a single command:

```sh
chmod +x start.sh
./start.sh
```

The script will:

- Start all containers via Docker Compose
- Wait 10 seconds for services to initialize
- Display container status and access URLs

Trigger some app endpoints:

```sh
curl http://localhost:3000/
curl http://localhost:3000/health
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

<img width="1823" height="1057" alt="image" src="https://github.com/user-attachments/assets/34d0b1f9-8787-40cc-ae13-1ddfd06d2d30" />
<img width="466" height="331" alt="image" src="https://github.com/user-attachments/assets/93b21641-ba6b-41e6-a880-a5bcfca6ea9a" />
<img width="704" height="256" alt="image" src="https://github.com/user-attachments/assets/28212053-9e6c-4437-9371-908dd6f8f8ac" />
<img width="1917" height="795" alt="image" src="https://github.com/user-attachments/assets/452e1ecc-c4e4-4f6a-b9d1-b0db71b7e990" />
<img width="1919" height="751" alt="image" src="https://github.com/user-attachments/assets/e4446992-f36e-439f-b001-8d79225e20cf" />
<img width="1919" height="1133" alt="image" src="https://github.com/user-attachments/assets/16011090-311e-469d-8188-080c1d05bc05" />

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

Everything runs locally with a single command and can be verified easily.
