package com.company.lending.deployment;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
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

    private static final Logger LOG = LoggerFactory.getLogger(StartupRestProcessDeployer.class);

    private static final String DEPLOYMENT_NAME = "consumer-lending";

    // Resources included in one deployment so embedded:app:forms/... is resolvable in Tasklist.
    private static final List<String> DEPLOYMENT_RESOURCES = Arrays.asList(
            "bpmn/european-consumer-lending.bpmn",
            "public/forms/customer-info.html",
            "public/forms/loan-propositions.html",
            "public/forms/select-proposition.html",
            "public/forms/contract-signature.html"
    );

    @Value("${camunda.rest.deployment-url:http://camunda:8080/engine-rest/deployment/create}")
    private String deploymentUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    public void deployProcess() {
        try {
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            body.add("deployment-name", DEPLOYMENT_NAME);
            body.add("enable-duplicate-filtering", "false");
            body.add("deploy-changed-only", "false");

            int index = 0;
            for (String classpathLocation : DEPLOYMENT_RESOURCES) {
                body.add("data-" + index++, buildFilePart(classpathLocation));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            LOG.info("Deploying BPMN + forms to Camunda via REST: {}", deploymentUrl);
            ResponseEntity<String> response =
                    restTemplate.postForEntity(deploymentUrl, request, String.class);

            LOG.info("Camunda deployment response status={}, body={}",
                    response.getStatusCodeValue(), response.getBody());

        } catch (Exception e) {
            LOG.error("Failed to deploy process/resources to Camunda", e);
        }
    }

    private HttpEntity<ByteArrayResource> buildFilePart(String classpathLocation) throws IOException {
        ClassPathResource resource = new ClassPathResource(classpathLocation);
        if (!resource.exists()) {
            throw new IOException("Classpath resource not found: " + classpathLocation);
        }

        String deploymentFilename = toDeploymentFilename(classpathLocation);
        byte[] content = readAllBytes(resource.getInputStream());
        ByteArrayResource fileResource = new NamedByteArrayResource(content, deploymentFilename);

        HttpHeaders partHeaders = new HttpHeaders();
        partHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        partHeaders.setContentDisposition(ContentDisposition
                .builder("form-data")
                .name(deploymentFilename)
                .filename(deploymentFilename, StandardCharsets.UTF_8)
                .build());

        return new HttpEntity<>(fileResource, partHeaders);
    }

    private String toDeploymentFilename(String classpathLocation) {
        // Keep deployment names aligned with embedded form keys.
        if (classpathLocation.startsWith("public/")) {
            return classpathLocation.substring("public/".length()); // forms/...
        }
        return classpathLocation;
    }

    private byte[] readAllBytes(InputStream inputStream) throws IOException {
        try (InputStream in = inputStream; ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            byte[] data = new byte[4096];
            int nRead;
            while ((nRead = in.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            return buffer.toByteArray();
        }
    }

    private static final class NamedByteArrayResource extends ByteArrayResource {
        private final String filename;

        private NamedByteArrayResource(byte[] byteArray, String filename) {
            super(byteArray);
            this.filename = filename;
        }

        @Override
        public String getFilename() {
            return filename;
        }
    }
}