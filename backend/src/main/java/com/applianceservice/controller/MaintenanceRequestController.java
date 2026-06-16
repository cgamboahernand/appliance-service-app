package com.applianceservice.controller;

import com.applianceservice.dto.CreateMaintenanceRequestDto;
import com.applianceservice.dto.UpdateStatusDto;
import com.applianceservice.model.MaintenanceRequest;
import com.applianceservice.service.MaintenanceRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceRequestController {

    private final MaintenanceRequestService service;

    public MaintenanceRequestController(MaintenanceRequestService service) {
        this.service = service;
    }

    @GetMapping
    public List<MaintenanceRequest> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> getById(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(@RequestBody CreateMaintenanceRequestDto dto) {
        MaintenanceRequest r = service.create(
                dto.getUserId(), dto.getSerialId(), dto.getDescription(), dto.getPreferredDate());
        return ResponseEntity.status(HttpStatus.CREATED).body(r);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<MaintenanceRequest> updateStatus(@PathVariable String id, @RequestBody UpdateStatusDto dto) {
        MaintenanceRequest r = service.updateStatus(id, dto.getStatus());
        return ResponseEntity.ok(r);
    }
}
