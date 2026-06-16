package com.applianceservice.controller;

import com.applianceservice.model.Appliance;
import com.applianceservice.service.ApplianceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appliances")
public class ApplianceController {

    private final ApplianceService service;

    public ApplianceController(ApplianceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Appliance> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appliance> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/serial/{serial}")
    public ResponseEntity<Appliance> getBySerial(@PathVariable String serial) {
        return service.findBySerial(serial)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
