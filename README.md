# Camunda 7 CE - European Consumer Lending

This repository gives you a local Camunda 7 setup for a consumer lending process.

If you are new to Camunda and Docker, this README walks you through:
- what to install,
- how to start everything,
- where to open Camunda in the browser,
- how to deploy and run the BPMN process,
- how to stop and reset the environment.

## What This Project Contains

- Camunda 7 engine and web apps
- PostgreSQL database
- Worker service (external task workers)
- BPMN process in `bpmn/lending/european-consumer-lending.bpmn`
- DMN rules in `dmn/credit-risk.dmn`

## 1) Prerequisites

Install these first:

1. Docker Desktop
2. Git

Optional (only if you want to build/run Java service locally outside Docker):
- Java 17+
- Maven 3.9+

### Verify tools

macOS or Linux:
```bash
docker --version
docker compose version
git --version
```

Windows (PowerShell):
```powershell
docker --version
docker compose version
git --version
```

## 2) Clone and open the repo

macOS/Linux:
```bash
git clone <your-repo-url>
cd camundaCE-setup
```

Windows (PowerShell):
```powershell
git clone <your-repo-url>
cd camundaCE-setup
```

## 3) Choose the correct environment file

This project uses different env files by platform.

- macOS Apple Silicon (M1/M2/M3): `.env.arm`
- macOS Intel: `.env.local`
- Windows: `.env.windows`

### How to check your Mac CPU type

```bash
uname -m
```

- `arm64` => use `.env.arm`
- `x86_64` => use `.env.local`

## 4) Start Camunda

### macOS Apple Silicon (M1/M2/M3)

```bash
docker compose --env-file .env.arm up -d
```

### macOS Intel

```bash
docker compose --env-file .env.local up -d
```

### Windows (PowerShell)

```powershell
docker compose --env-file .env.windows up -d
```

## 5) Confirm services are running

macOS/Linux:
```bash
docker compose ps
```

Windows (PowerShell):
```powershell
docker compose ps
```

You should see services like:
- `camunda-postgres`
- `camunda7`
- `lending-worker-service`

You can also follow logs:

macOS/Linux:
```bash
docker compose logs -f
```

Windows (PowerShell):
```powershell
docker compose logs -f
```

## 6) Open Camunda in browser

Open this URL:

`http://localhost:8081/camunda`

Default login (if unchanged in your image/config):
- username: `demo`
- password: `demo`

## 7) Deploy the BPMN process

1. Open Camunda Cockpit
2. Go to Deployments
3. Click New Deployment
4. Upload `bpmn/lending/european-consumer-lending.bpmn`
5. Click Deploy

Optional via REST API:

macOS/Linux:
```bash
curl -X POST \
  -F "file=@bpmn/lending/european-consumer-lending.bpmn" \
  http://localhost:8081/engine-rest/deployment/create
```

Windows (PowerShell):
```powershell
curl.exe -X POST -F "file=@bpmn/lending/european-consumer-lending.bpmn" http://localhost:8081/engine-rest/deployment/create
```

## 8) Start a process instance

From Tasklist UI:
1. Open Tasklist
2. Click Start Process
3. Select process key `EuropeanConsumerLending`
4. Complete the first user form

Or via REST:

macOS/Linux:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:8081/engine-rest/process-definition/key/EuropeanConsumerLending/start
```

Windows (PowerShell):
```powershell
curl.exe -X POST -H "Content-Type: application/json" -d "{}" http://localhost:8081/engine-rest/process-definition/key/EuropeanConsumerLending/start
```

## 9) Stop Camunda

Graceful stop (recommended):

macOS/Linux:
```bash
docker compose down
```

Windows (PowerShell):
```powershell
docker compose down
```

## 10) Full reset (delete database data)

Use only when you want a clean new environment:

macOS/Linux:
```bash
docker compose down -v
```

Windows (PowerShell):
```powershell
docker compose down -v
```

## 11) Useful commands

macOS/Linux:
```bash
docker compose ps
docker compose logs -f
docker compose logs camunda --tail=200
docker compose restart camunda
docker compose down
docker compose down -v
```

Windows (PowerShell):
```powershell
docker compose ps
docker compose logs -f
docker compose logs camunda --tail=200
docker compose restart camunda
docker compose down
docker compose down -v
```

## 12) Troubleshooting

### Port 8081 already in use

- Stop the app using port 8081, or
- Change `docker-compose.yml` Camunda port mapping (for example `8082:8080`) and open `http://localhost:8082/camunda`.

### Docker Desktop not running

Start Docker Desktop and rerun the startup command.

### Camunda does not open immediately

Wait 30-60 seconds and check logs:

macOS/Linux:
```bash
docker compose logs camunda --tail=200
```

Windows (PowerShell):
```powershell
docker compose logs camunda --tail=200
```

### Need to clean orphan containers

macOS/Linux:
```bash
docker compose down --remove-orphans
```

Windows (PowerShell):
```powershell
docker compose down --remove-orphans
```

## 13) Project structure

```text
camundaCE-setup/
  docker-compose.yml
  README.md
  bpmn/lending/european-consumer-lending.bpmn
  dmn/credit-risk.dmn
  docs/
  worker-service/
```
