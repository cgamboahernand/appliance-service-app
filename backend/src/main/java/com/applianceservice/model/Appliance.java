package com.applianceservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "appliances")
public class Appliance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, unique = true)
    private String serial;

    public Appliance() {}

    public Appliance(String name, String description, String serial) {
        this.name = name;
        this.description = description;
        this.serial = serial;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSerial() { return serial; }
    public void setSerial(String serial) { this.serial = serial; }
}
