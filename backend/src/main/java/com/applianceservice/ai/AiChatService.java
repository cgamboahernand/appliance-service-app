package com.applianceservice.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiChatService {

    private final ChatClient chatClient;
    private final ApplianceTools applianceTools;

    private static final String SYSTEM_PROMPT = """
            You are an appliance service assistant for our company. Your ONLY purpose is to help users with:
            1. Browsing and purchasing appliances from our catalog
            2. Filing compliance reports for their purchased appliances
            3. Scheduling maintenance requests for their purchased appliances
            4. Viewing their purchases, compliance reports, and maintenance requests

            STRICT RULES:
            - You must NEVER answer questions outside of the appliance service domain.
            - Always be helpful and friendly ONLY within your domain.
            - When listing appliances or purchases, use clear formatted output.
            - Before performing any action (purchase, file compliance, schedule maintenance), confirm the details with the user.
            - The current user is always 'user-1'.
            """;

    private static final String OFF_TOPIC_RESPONSE =
            "I can only assist with appliance-related tasks: browsing our catalog, making purchases, filing compliance reports, or scheduling maintenance. How can I help you with your appliances today?";

    private static final List<String> ON_TOPIC_KEYWORDS = List.of(
            "appliance", "purchase", "buy", "catalog", "compliance", "report", "maintenance",
            "schedule", "repair", "fix", "broken", "defect", "safety", "recall", "regulatory",
            "refrigerator", "fridge", "dishwasher", "washer", "dryer", "microwave", "stove",
            "oven", "freezer", "toaster", "coffee", "blender", "iron", "vacuum", "mop",
            "air conditioner", "heater", "purifier", "dehumidifier", "fan", "speaker",
            "water heater", "serial", "owned", "my appliance", "list", "show", "what do i have",
            "file", "issue", "problem", "request", "service", "hello", "hi", "hey", "help",
            "thanks", "thank you", "yes", "no", "ok", "sure", "please", "what can you do"
    );

    public AiChatService(ChatClient.Builder chatClientBuilder, ApplianceTools applianceTools) {
        this.applianceTools = applianceTools;
        this.chatClient = chatClientBuilder.build();
    }

    private boolean isOnTopic(String message) {
        String lower = message.toLowerCase();
        return ON_TOPIC_KEYWORDS.stream().anyMatch(lower::contains);
    }

    public String chat(String sessionId, String userMessage) {
        if (!isOnTopic(userMessage)) {
            return OFF_TOPIC_RESPONSE;
        }

        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(userMessage)
                .tools(applianceTools)
                .call()
                .content();
    }
}