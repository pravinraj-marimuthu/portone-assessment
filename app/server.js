const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const winston = require('winston');
const { register, Counter, Histogram, collectDefaultMetrics } = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

// Ensure log directory exists (mounted from host to ./logs)
const logDir = process.env.LOG_DIR || '/logs';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// Winston logger to a file as plain strings
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.printf(info => info.message), // <-- output as string
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'app.log') })
  ]
});

// HTTP request logging via morgan to winston
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()) // <-- plain string
  }
}));

// Prometheus metrics
collectDefaultMetrics();
const httpRequests = new Counter({ name: 'http_requests_total', help: 'Total HTTP requests', labelNames: ['method', 'route', 'code'] });
const httpDuration = new Histogram({ name: 'request_duration_seconds', help: 'Request duration in seconds', labelNames: ['method', 'route', 'code'] });

// middleware to measure
app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on('finish', () => {
    httpRequests.inc({ method: req.method, route: req.path, code: res.statusCode });
    end({ method: req.method, route: req.path, code: res.statusCode });
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  logger.info(`Root endpoint called`);
  res.json({ status: 'ok', message: 'Hello from local-stack' });
});

app.get('/health', (req, res) => {
  logger.info(`Health endpoint called`);
  res.status(200).send('healthy');
});

app.get('/slow', (req, res) => {
  setTimeout(() => {
    logger.info(`Slow endpoint responded`);
    res.send('slow response');
  }, 800);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  logger.info(`App started on port ${port}`);
  console.log(`App listening on ${port}`);
});
