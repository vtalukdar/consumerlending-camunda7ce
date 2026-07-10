# BPMN Process Deployment Guide

## Automatic Deployment (Recommended)

### Option 1: Using Camunda Web UI

1. **Start Camunda:**
   ```bash
   ./start.sh
   ```

2. **Open Camunda in Browser:**
   - Navigate to: http://localhost:8081/camunda
   - Login: `demo` / `demo`

3. **Deploy BPMN File:**
   - Click on **Cockpit** (main navigation)
   - Go to **Deployments** section
   - Click **Add Deployment**
   - Select your BPMN file from `bpmn/lending/european-consumer-lending.bpmn`
   - Click **Deploy**

4. **Verify Deployment:**
   - You should see the process listed under Processes
   - Click on the process to view the diagram

### Option 2: Programmatic Deployment (For Automation)

The `worker-service` can be configured to auto-deploy BPMN files on startup.

Create `worker-service/src/main/resources/application.yml`:

```yaml
camunda:
  bpm:
    auto-deployment-enabled: true
    deployment-resource-pattern: "classpath*:/bpmn/*.bpmn"
```

Place BPMN files in `worker-service/src/main/resources/bpmn/`

---

## Manual Deployment via REST API

### Using cURL

```bash
curl -X POST \
  -F "file=@bpmn/lending/european-consumer-lending.bpmn" \
  http://localhost:8081/engine-rest/deployment/create
```

---

## Verify Deployment

### Check Deployed Processes

```bash
curl -X GET http://localhost:8081/engine-rest/process-definition
```

### Start a New Process Instance

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  http://localhost:8081/engine-rest/process-definition/key/EuropeanConsumerLending/start
```

---

## Troubleshooting

### BPMN File Not Deploying

1. **Check file format:**
   - File must be valid XML
   - Use Camunda Modeler to validate

2. **Check file location:**
   - File must be in correct folder or referenced correctly

3. **View deployment logs:**
   ```bash
   docker compose logs camunda | tail -100
   ```

### Process Not Starting

1. **Verify deployment:**
   - Go to Camunda UI → Cockpit
   - Check if process appears in Processes list

2. **Check for errors:**
   - View Camunda logs: `docker compose logs camunda`

3. **Restart Camunda:**
   ```bash
   

---

## BPMN File Structure

Your BPMN file should be in:

```
bpmn/
├── lending/
│   ├── european-consumer-lending.bpmn  ← Main process
│   └── [other processes]
```

Each BPMN must have a unique `id` in the XML:

```xml
<process id="EuropeanConsumerLending" name="..." isExecutable="true">
  ...
</process>
```

---
