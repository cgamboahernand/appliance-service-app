package com.applianceservice.repository;

import com.applianceservice.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, String> {
    List<Purchase> findByUserId(String userId);
    boolean existsBySerialId(String serialId);
}
