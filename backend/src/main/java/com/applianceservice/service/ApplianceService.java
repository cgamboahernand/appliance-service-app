package com.applianceservice.service;

import com.applianceservice.model.Appliance;
import com.applianceservice.repository.ApplianceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplianceService {

    private final ApplianceRepository repository;

    public ApplianceService(ApplianceRepository repository) {
        this.repository = repository;
    }

    public List<Appliance> findAll() {
        return repository.findAll();
    }

    public Optional<Appliance> findById(String id) {
        return repository.findById(id);
    }

    public Optional<Appliance> findBySerial(String serial) {
        return repository.findBySerial(serial);
    }
}
