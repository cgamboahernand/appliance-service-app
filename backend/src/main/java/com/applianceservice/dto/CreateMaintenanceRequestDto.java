package com.applianceservice.dto;

import java.time.LocalDate;

public class CreateMaintenanceRequestDto {
    private String userId;
    private String serialId;
    private String description;
    private LocalDate preferredDate;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSerialId() { return serialId; }
    public void setSerialId(String serialId) { this.serialId = serialId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }
}
