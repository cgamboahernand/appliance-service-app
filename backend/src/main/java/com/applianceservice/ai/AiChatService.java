package com.applianceservice.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AiChatService {

    private final ChatClient chatClient;
    private final Map<String, List<Message>> conversationHistory = new ConcurrentHashMap<>();

    private static final String SYSTEM_PROMPT = """
            You are a helpful customer service assistant for an appliance service company.
            You can help users with the following tasks:
            
            1. **Browse Appliances** — Show available appliances in the catalog
            2. **Purchase Appliances** — Help users buy an appliance by its serial number
            3. **View My Appliances** — Show what appliances the user already owns
            4. **File Compliance Reports** — Help users report safety issues, defects, or recalls for their appliances
            5. **Schedule Maintenance** — Help users request a maintenance service for their appliances
            6. **View Maintenance Requests** — Show the user's maintenance request history
            7. **View Compliance Reports** — Show the user's compliance report history
            
            Guidelines:
            - Be friendly, concise, and helpful.
            - When the user wants to perform an action (purchase, file compliance, schedule maintenance), gather the required information conversationally before calling the tool.
            - For purchases: confirm which appliance the user wants before proceeding.
            - For compliance reports: ask for the reason (Safety, Defect, Regulatory, Recall, Other) and a description.
            - For maintenance: ask for a description of the issue and a preferred date.
            - Always confirm the result of an action to the user.
            - If the user asks something unrelated to appliance services, politely redirect them.
            - Today's date is %s.
            """.formatted(java.time.LocalDate.now().toString());

    public AiChatService(ChatClient.Builder chatClientBuilder, ApplianceTools applianceTools) {
        this.chatClient = chatClientBuilder
                .defaultSystem(SYSTEM_PROMPT)
                .defaultTools(applianceTools)
                .build();
    }

    public String chat(String sessionId, String userMessage) {
        List<Message> history = conversationHistory.computeIfAbsent(sessionId, k -> new ArrayList<>());

        history.add(new UserMessage(userMessage));

        // Build messages list: system + history
        List<Message> messages = new ArrayList<>();
        messages.add(new SystemMessage(SYSTEM_PROMPT));
        messages.addAll(history);

        String response = chatClient.prompt(new Prompt(messages))
                .call()
                .content();

        history.add(new AssistantMessage(response));

        // Keep history manageable (last 40 messages)
        if (history.size() > 40) {
            List<Message> trimmed = new ArrayList<>(history.subList(history.size() - 40, history.size()));
            history.clear();
            history.addAll(trimmed);
        }

        return response;
    }

    public void clearSession(String sessionId) {
        conversationHistory.remove(sessionId);
    }
}
