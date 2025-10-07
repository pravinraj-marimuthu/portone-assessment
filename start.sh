#!/usr/bin/env bash
set -e


# create logs dir if missing
mkdir -p logs


# bring up everything
docker-compose up --build -d


echo "Waiting a few seconds for services to come up..."
sleep 10

docker ps --format "table {{.Names}}\t{{.Status}}"

# show endpoints
cat <<EOF


STACK STARTED.


App: http://localhost:3000/
Health: http://localhost:3000/health
Prometheus: http://localhost:9090/
Grafana: http://localhost:3001/ (user: admin / password: admin)
Kibana: http://localhost:5601/
Elasticsearch: http://localhost:9200/


To tail app logs: tail -f logs/app.log


EOF