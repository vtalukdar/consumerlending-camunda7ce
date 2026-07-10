package com.company.lending.deployment;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
public class StartupRestProcessDeployer {

    private static final Logger log = LoggerFactory.getLogger(StartupRestProcessDeployer.class);

    @Value("${camunda.bpm.client.base-url:${CAMUNDA_BASE_URL:http://localhost:8081/engine-rest}}")
    private String camundaBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @EventListener(ApplicationReadyEvent.class)
    public void deployOnStartup() throws IOException {
        var bpmnResource = new ClassPathResource("bpmn/european-consumer-lending.bpmn");
        if (!bpmnResource.exists()) {
            throw new IllegalStateException("BPMN not found on classpath: bpmn/european-consumer-lending.bpmn");
        }

        var deployUrl = camundaBaseUrl + "/deployment/create";
        log.info("Deploying BPMN to Camunda via REST: {}", deployUrl);

        var body = new LinkedMultiValueMap<String, Object>();
        body.add("deployment-name", "consumer-lending");
        body.add("enable-duplicate-filtering", "true");
        body.add("deploy-changed-only", "true");
        body.add("data", new NamedByteArrayResource(
                bpmnResource.getInputStream().readAllBytes(),
                "european-consumer-lending.bpmn"));

        var headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(deployUrl, requestEntity, String.class);

        log.info("Camunda deployment response status={}, body={}",
                response.getStatusCodeValue(),
                Objects.toString(response.getBody(), ""));
    }

    static class NamedByteArrayResource extends org.springframework.core.io.ByteArrayResource {
        private final String filename;

        NamedByteArrayResource(byte[] byteArray, String filename) {
            super(byteArray);
            this.filename = filename;
        }

        @Override
        public String getFilename() {
            return filename;
        }

        @Override
        public String getDescription() {
            return new String(getByteArray(), StandardCharsets.UTF_8);
        }
    }
}