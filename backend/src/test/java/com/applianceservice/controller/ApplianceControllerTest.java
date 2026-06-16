package com.applianceservice.controller;

import com.applianceservice.model.Appliance;
import com.applianceservice.repository.ApplianceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ApplianceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ApplianceRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
        repository.save(new Appliance("Refrigerator", "Double-door fridge", "REF-1001"));
        repository.save(new Appliance("Washer", "Front-load washer", "WM-2001"));
    }

    @Test
    void shouldGetAllAppliances() throws Exception {
        mockMvc.perform(get("/api/appliances"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void shouldGetApplianceBySerial() throws Exception {
        mockMvc.perform(get("/api/appliances/serial/REF-1001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Refrigerator"));
    }

    @Test
    void shouldReturn404ForUnknownSerial() throws Exception {
        mockMvc.perform(get("/api/appliances/serial/UNKNOWN"))
                .andExpect(status().isNotFound());
    }
}
