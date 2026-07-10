# Camunda 7 CE - Consumer Lending

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
- BPMN process in `worker-service/src/main/resources/bpmn/european-consumer-lending.bpmn`
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

## 3) Optional: choose a custom env file

You can start with the default compose command because `docker-compose.yml` already has a safe default for `CAMUNDA_IMAGE`.

If you still want to provide a specific env file manually, these are available:

- `.env.arm`
- `.env.local`
- `.env.windows`

## 4) Start Camunda

Generic (recommended):

```bash
docker compose up --build
```

Optional background mode:

```bash
docker compose up --build -d
```

Optional with an explicit env file:

```bash
docker compose --env-file .env.local up --build -d
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

## 7) BPMN deployment behavior (automatic)

No manual deployment is needed in the default setup.

At startup, Camunda is configured to load BPMN files only from:

- `worker-service/src/main/resources/bpmn`

This means:

- `european-consumer-lending.bpmn` is auto-deployed when the stack starts.
- Camunda sample processes like `invoice` and `reviewInvoice` are not auto-deployed.

To verify:

```bash
curl -s "http://localhost:8081/engine-rest/process-definition?key=EuropeanConsumerLending"
```

If you change BPMN and want a clean re-run:

```bash
docker compose down -v
docker compose up --build -d
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
  dmn/credit-risk.dmn
  docs/
  worker-service/
    src/main/resources/bpmn/european-consumer-lending.bpmn
```
