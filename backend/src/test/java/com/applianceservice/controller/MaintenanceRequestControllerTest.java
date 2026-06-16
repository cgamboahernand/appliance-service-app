package com.applianceservice.controller;

import com.applianceservice.model.MaintenanceRequest;
import com.applianceservice.repository.MaintenanceRequestRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MaintenanceRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MaintenanceRequestRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void shouldCreateMaintenanceRequest() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "userId", "user-1",
                "serialId", "REF-1001",
                "description", "Makes loud noise",
                "preferredDate", "2026-07-01"
        ));

        mockMvc.perform(post("/api/maintenance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("Pending"))
                .andExpect(jsonPath("$.description").value("Makes loud noise"));
    }

    @Test
    void shouldGetAllMaintenanceRequests() throws Exception {
        repository.save(new MaintenanceRequest("user-1", "REF-1001", "Leaking water", LocalDate.of(2026, 7, 15)));

        mockMvc.perform(get("/api/maintenance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void shouldGetMaintenanceRequestById() throws Exception {
        MaintenanceRequest r = repository.save(
                new MaintenanceRequest("user-1", "WM-2001", "Not spinning", LocalDate.of(2026, 8, 1)));

        mockMvc.perform(get("/api/maintenance/" + r.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serialId").value("WM-2001"));
    }

    @Test
    void shouldUpdateMaintenanceStatus() throws Exception {
        MaintenanceRequest r = repository.save(
                new MaintenanceRequest("user-1", "REF-1001", "Not cooling", LocalDate.of(2026, 7, 10)));

        String body = objectMapper.writeValueAsString(Map.of("status", "Scheduled"));

        mockMvc.perform(patch("/api/maintenance/" + r.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Scheduled"));
    }

    @Test
    void shouldReturn404ForUnknownId() throws Exception {
        mockMvc.perform(get("/api/maintenance/unknown-id"))
                .andExpect(status().isNotFound());
    }
}
