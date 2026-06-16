package com.applianceservice.ai;

import com.applianceservice.model.Appliance;
import com.applianceservice.model.Compliance;
import com.applianceservice.model.MaintenanceRequest;
import com.applianceservice.model.Purchase;
import com.applianceservice.service.ApplianceService;
import com.applianceservice.service.ComplianceService;
import com.applianceservice.service.MaintenanceRequestService;
import com.applianceservice.service.PurchaseService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ApplianceTools {

    private final ApplianceService applianceService;
    private final PurchaseService purchaseService;
    private final ComplianceService complianceService;
    private final MaintenanceRequestService maintenanceRequestService;

    public ApplianceTools(ApplianceService applianceService,
                          PurchaseService purchaseService,
                          ComplianceService complianceService,
                          MaintenanceRequestService maintenanceRequestService) {
        this.applianceService = applianceService;
        this.purchaseService = purchaseService;
        this.complianceService = complianceService;
        this.maintenanceRequestService = maintenanceRequestService;
    }

    @Tool(description = "List all available appliances in the catalog with their name, description, and serial number. Use this when the user wants to browse or see what appliances are available for purchase.")
    public String listAppliances() {
        List<Appliance> appliances = applianceService.findAll();
        if (appliances.isEmpty()) {
            return "No appliances found in the catalog.";
        }
        StringBuilder sb = new StringBuilder("Here are the appliances in our catalog:\n\n");
        for (int i = 0; i < appliances.size(); i++) {
            Appliance a = appliances.get(i);
            boolean available = purchaseService.isAvailable(a.getSerial());
            sb.append(String.format("%d. **%s** — %s\n   Serial: %s | Status: %s\n",
                    i + 1, a.getName(), a.getDescription(),
                    a.getSerial(), available ? "✅ Available" : "❌ Sold"));
        }
        return sb.toString();
    }

    @Tool(description = "Purchase an appliance for the user by its serial number. Only call this after confirming with the user which appliance they want to buy. The userId is always 'user-1'.")
    public String purchaseAppliance(
            @ToolParam(description = "The serial number of the appliance to purchase") String serialNumber) {
        try {
            if (!purchaseService.isAvailable(serialNumber)) {
                return "Sorry, the appliance with serial " + serialNumber + " is already sold.";
            }
            Purchase p = purchaseService.purchase("user-1", serialNumber);
            Appliance a = applianceService.findBySerial(serialNumber).orElse(null);
            String name = a != null ? a.getName() : serialNumber;
            return "Successfully purchased " + name + " (Serial: " + serialNumber + "). Purchase ID: " + p.getId();
        } catch (Exception e) {
            return "Failed to purchase appliance: " + e.getMessage();
        }
    }

    @Tool(description = "List the user's purchased appliances. Use this when the user asks about their appliances, what they own, or before filing compliance or maintenance requests.")
    public String listMyPurchases() {
        List<Purchase> purchases = purchaseService.findByUserId("user-1");
        if (purchases.isEmpty()) {
            return "You don't have any purchased appliances yet.";
        }
        StringBuilder sb = new StringBuilder("Your purchased appliances:\n\n");
        for (int i = 0; i < purchases.size(); i++) {
            Purchase p = purchases.get(i);
            Appliance a = applianceService.findBySerial(p.getSerialId()).orElse(null);
            String name = a != null ? a.getName() : "Unknown";
            sb.append(String.format("%d. **%s**\n   Serial: %s | Purchased: %s\n",
                    i + 1, name, p.getSerialId(), p.getPurchaseDate()));
        }
        return sb.toString();
    }

    @Tool(description = "File a compliance report for a purchased appliance. Use this when the user wants to report a safety issue, defect, or regulatory concern. Valid reasons are: Safety, Defect, Regulatory, Recall, Other. The appliance MUST be one the user has purchased.")
    public String fileCompliance(
            @ToolParam(description = "Serial number of the appliance") String serialNumber,
            @ToolParam(description = "Reason for the report: Safety, Defect, Regulatory, Recall, or Other") String reason,
            @ToolParam(description = "Description of the compliance issue") String description) {
        try {
            // Validate appliance exists
            if (applianceService.findBySerial(serialNumber).isEmpty()) {
                return "Error: No appliance found with serial " + serialNumber + ". Please use listMyPurchases to see valid appliances.";
            }
            // Validate the user owns this appliance
            List<Purchase> userPurchases = purchaseService.findByUserId("user-1");
            boolean ownsAppliance = userPurchases.stream().anyMatch(p -> p.getSerialId().equals(serialNumber));
            if (!ownsAppliance) {
                return "Error: You don't own the appliance with serial " + serialNumber + ". You can only file compliance reports for appliances you've purchased.";
            }
            Compliance c = complianceService.create(serialNumber, "user-1", reason, description);
            return "Compliance report filed successfully. Report ID: " + c.getId()
                    + " | Status: " + c.getStatus();
        } catch (Exception e) {
            return "Failed to file compliance report: " + e.getMessage();
        }
    }

    @Tool(description = "Schedule a maintenance service request for a purchased appliance. Use this when the user wants to get an appliance serviced, repaired, or inspected. The appliance MUST be one the user has purchased.")
    public String scheduleMaintenance(
            @ToolParam(description = "Serial number of the appliance needing service") String serialNumber,
            @ToolParam(description = "Description of the issue or service needed") String description,
            @ToolParam(description = "Preferred service date in YYYY-MM-DD format") String preferredDate) {
        try {
            // Validate appliance exists
            if (applianceService.findBySerial(serialNumber).isEmpty()) {
                return "Error: No appliance found with serial " + serialNumber + ". Please use listMyPurchases to see valid appliances.";
            }
            // Validate the user owns this appliance
            List<Purchase> userPurchases = purchaseService.findByUserId("user-1");
            boolean ownsAppliance = userPurchases.stream().anyMatch(p -> p.getSerialId().equals(serialNumber));
            if (!ownsAppliance) {
                return "Error: You don't own the appliance with serial " + serialNumber + ". You can only schedule maintenance for appliances you've purchased.";
            }
            LocalDate date = LocalDate.parse(preferredDate);
            MaintenanceRequest r = maintenanceRequestService.create("user-1", serialNumber, description, date);
            return "Maintenance request created successfully. Request ID: " + r.getId()
                    + " | Status: " + r.getStatus() + " | Preferred date: " + preferredDate;
        } catch (Exception e) {
            return "Failed to schedule maintenance: " + e.getMessage();
        }
    }

    @Tool(description = "List all maintenance requests for the user. Use this when the user asks about their pending or past maintenance requests.")
    public String listMaintenanceRequests() {
        List<MaintenanceRequest> requests = maintenanceRequestService.findByUserId("user-1");
        if (requests.isEmpty()) {
            return "You don't have any maintenance requests.";
        }
        return requests.stream()
                .map(r -> {
                    Appliance a = applianceService.findBySerial(r.getSerialId()).orElse(null);
                    String name = a != null ? a.getName() : "Unknown";
                    return String.format("- %s (Serial: %s) — %s | Status: %s | Date: %s",
                            name, r.getSerialId(), r.getDescription(), r.getStatus(), r.getPreferredDate());
                })
                .collect(Collectors.joining("\n"));
    }

    @Tool(description = "List all compliance reports for the user. Use this when the user asks about their filed compliance reports.")
    public String listComplianceReports() {
        List<Compliance> reports = complianceService.findByUserId("user-1");
        if (reports.isEmpty()) {
            return "You don't have any compliance reports.";
        }
        return reports.stream()
                .map(c -> {
                    Appliance a = applianceService.findBySerial(c.getSerialId()).orElse(null);
                    String name = a != null ? a.getName() : "Unknown";
                    return String.format("- %s (Serial: %s) — %s: %s | Status: %s",
                            name, c.getSerialId(), c.getReason(), c.getDescription(), c.getStatus());
                })
                .collect(Collectors.joining("\n"));
    }
}
