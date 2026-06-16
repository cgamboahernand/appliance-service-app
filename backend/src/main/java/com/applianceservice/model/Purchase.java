package com.applianceservice.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String serialId;

    @Column(nullable = false)
    private LocalDate purchaseDate;

    public Purchase() {}

    public Purchase(String userId, String serialId, LocalDate purchaseDate) {
        this.userId = userId;
        this.serialId = serialId;
        this.purchaseDate = purchaseDate;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSerialId() { return serialId; }
    public void setSerialId(String serialId) { this.serialId = serialId; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
}
