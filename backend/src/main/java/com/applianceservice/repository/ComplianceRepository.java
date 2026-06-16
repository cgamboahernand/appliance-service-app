package com.applianceservice.repository;

import com.applianceservice.model.Compliance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplianceRepository extends JpaRepository<Compliance, String> {
    List<Compliance> findByUserId(String userId);
    boolean existsBySerialIdAndStatus(String serialId, String status);
}
