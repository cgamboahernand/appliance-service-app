package com.applianceservice.controller;

import com.applianceservice.dto.CreateComplianceDto;
import com.applianceservice.dto.UpdateStatusDto;
import com.applianceservice.model.Compliance;
import com.applianceservice.service.ComplianceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compliances")
public class ComplianceController {

    private final ComplianceService service;

    public ComplianceController(ComplianceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Compliance> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compliance> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateComplianceDto dto) {
        try {
            Compliance c = service.create(dto.getSerialId(), dto.getUserId(), dto.getReason(), dto.getDescription());
            return ResponseEntity.status(HttpStatus.CREATED).body(c);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Compliance> updateStatus(@PathVariable String id, @RequestBody UpdateStatusDto dto) {
        Compliance c = service.updateStatus(id, dto.getStatus());
        return ResponseEntity.ok(c);
    }
}
