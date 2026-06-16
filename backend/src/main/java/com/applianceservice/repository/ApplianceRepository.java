package com.applianceservice.repository;

import com.applianceservice.model.Appliance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplianceRepository extends JpaRepository<Appliance, String> {
    Optional<Appliance> findBySerial(String serial);
}
