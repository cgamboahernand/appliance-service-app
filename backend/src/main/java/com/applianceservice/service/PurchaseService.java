package com.applianceservice.service;

import com.applianceservice.model.Purchase;
import com.applianceservice.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseService {

    private final PurchaseRepository repository;

    public PurchaseService(PurchaseRepository repository) {
        this.repository = repository;
    }

    public List<Purchase> findAll() {
        return repository.findAll();
    }

    public List<Purchase> findByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Optional<Purchase> findById(String id) {
        return repository.findById(id);
    }

    public Purchase purchase(String userId, String serialId) {
        if (repository.existsBySerialId(serialId)) {
            throw new IllegalStateException("Appliance with serial " + serialId + " is already purchased");
        }
        Purchase p = new Purchase(userId, serialId, LocalDate.now());
        return repository.save(p);
    }

    public boolean isAvailable(String serialId) {
        return !repository.existsBySerialId(serialId);
    }
}
