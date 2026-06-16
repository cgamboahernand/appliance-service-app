package com.applianceservice.service;

import com.applianceservice.model.Compliance;
import com.applianceservice.repository.ComplianceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComplianceService {

    private final ComplianceRepository repository;

    public ComplianceService(ComplianceRepository repository) {
        this.repository = repository;
    }

    public List<Compliance> findAll() {
        return repository.findAll();
    }

    public List<Compliance> findByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<Compliance> findById(String id) {
        return repository.findById(id);
    }

    public Compliance create(String serialId, String userId, String reason, String description) {
        if (repository.existsBySerialIdAndStatus(serialId, "Pending")) {
            throw new IllegalStateException("A pending compliance report already exists for appliance with serial " + serialId);
        }
        Compliance c = new Compliance(serialId, userId, reason, description);
        return repository.save(c);
    }

    public Compliance updateStatus(String id, String status) {
        Compliance c = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Compliance not found: " + id));
        c.setStatus(status);
        return repository.save(c);
    }
}
