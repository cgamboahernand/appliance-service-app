package com.applianceservice.service;

import com.applianceservice.model.MaintenanceRequest;
import com.applianceservice.repository.MaintenanceRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository repository;

    public MaintenanceRequestService(MaintenanceRequestRepository repository) {
        this.repository = repository;
    }

    public List<MaintenanceRequest> findAll() {
        return repository.findAll();
    }

    public List<MaintenanceRequest> findByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<MaintenanceRequest> findById(String id) {
        return repository.findById(id);
    }

    public MaintenanceRequest create(String userId, String serialId, String description, LocalDate preferredDate) {
        MaintenanceRequest r = new MaintenanceRequest(userId, serialId, description, preferredDate);
        return repository.save(r);
    }

    public MaintenanceRequest updateStatus(String id, String status) {
        MaintenanceRequest r = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance request not found: " + id));
        r.setStatus(status);
        return repository.save(r);
    }
}
