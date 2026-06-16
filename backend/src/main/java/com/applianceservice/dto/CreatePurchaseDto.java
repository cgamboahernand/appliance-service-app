package com.applianceservice.dto;

public class CreatePurchaseDto {
    private String userId;
    private String serialId;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSerialId() { return serialId; }
    public void setSerialId(String serialId) { this.serialId = serialId; }
}
