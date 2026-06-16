package com.applianceservice.controller;

import com.applianceservice.ai.AiChatService;
import com.applianceservice.dto.ChatRequestDto;
import com.applianceservice.dto.ChatResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AiChatService aiChatService;

    public ChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDto> chat(@RequestBody ChatRequestDto request) {
        String response = aiChatService.chat(request.getSessionId(), request.getMessage());
        return ResponseEntity.ok(new ChatResponseDto(response));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> clearSession(@PathVariable String sessionId) {
        aiChatService.clearSession(sessionId);
        return ResponseEntity.noContent().build();
    }
}
