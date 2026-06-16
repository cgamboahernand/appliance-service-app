package com.applianceservice.repository;

import com.applianceservice.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, String> {
    List<MaintenanceRequest> findByUserId(String userId);
}
