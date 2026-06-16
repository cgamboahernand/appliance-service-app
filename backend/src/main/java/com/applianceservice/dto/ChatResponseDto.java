package com.applianceservice.dto;

public class ChatResponseDto {
    private String message;

    public ChatResponseDto() {}

    public ChatResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
