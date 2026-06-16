package com.applianceservice.controller;

import com.applianceservice.model.Purchase;
import com.applianceservice.repository.PurchaseRepository;
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
class PurchaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PurchaseRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
        repository.save(new Purchase("user-1", "REF-1001", LocalDate.of(2025, 1, 15)));
        repository.save(new Purchase("user-1", "WM-2001", LocalDate.of(2025, 3, 20)));
    }

    @Test
    void shouldGetAllPurchases() throws Exception {
        mockMvc.perform(get("/api/purchases"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void shouldGetPurchasesByUserId() throws Exception {
        mockMvc.perform(get("/api/purchases/user/user-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void shouldCreatePurchase() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of("userId", "user-2", "serialId", "DW-3001"));

        mockMvc.perform(post("/api/purchases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.serialId").value("DW-3001"));
    }

    @Test
    void shouldCheckAvailability() throws Exception {
        mockMvc.perform(get("/api/purchases/available/REF-1001"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        mockMvc.perform(get("/api/purchases/available/NEW-9999"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }
}
