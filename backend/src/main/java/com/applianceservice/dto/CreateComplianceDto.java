package com.applianceservice.dto;

public class CreateComplianceDto {
    private String serialId;
    private String userId;
    private String reason;
    private String description;

    public String getSerialId() { return serialId; }
    public void setSerialId(String serialId) { this.serialId = serialId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
