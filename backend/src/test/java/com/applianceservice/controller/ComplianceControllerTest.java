package com.applianceservice.controller;

import com.applianceservice.model.Compliance;
import com.applianceservice.repository.ComplianceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ComplianceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ComplianceRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void shouldCreateCompliance() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "serialId", "REF-1001",
                "userId", "user-1",
                "reason", "Malfunction",
                "description", "Fridge not cooling"
        ));

        mockMvc.perform(post("/api/compliances")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("Pending"))
                .andExpect(jsonPath("$.reason").value("Malfunction"));
    }

    @Test
    void shouldGetAllCompliances() throws Exception {
        repository.save(new Compliance("REF-1001", "user-1", "Broken", "Door handle broke"));

        mockMvc.perform(get("/api/compliances"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void shouldUpdateComplianceStatus() throws Exception {
        Compliance c = repository.save(new Compliance("REF-1001", "user-1", "Malfunction", "Not cooling"));

        String body = objectMapper.writeValueAsString(Map.of("status", "Reviewed"));

        mockMvc.perform(patch("/api/compliances/" + c.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Reviewed"));
    }
}
