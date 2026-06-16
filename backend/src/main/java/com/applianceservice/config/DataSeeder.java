package com.applianceservice.config;

import com.applianceservice.model.Appliance;
import com.applianceservice.model.Purchase;
import com.applianceservice.repository.ApplianceRepository;
import com.applianceservice.repository.PurchaseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(ApplianceRepository applianceRepo, PurchaseRepository purchaseRepo) {
        return args -> {
            // Seed appliances — Kitchen
            applianceRepo.save(new Appliance("Refrigerator", "Double-door refrigerator with ice maker and water dispenser", "REF-1001"));
            applianceRepo.save(new Appliance("Dishwasher", "Built-in dishwasher with 14 place settings and quiet operation", "DW-3001"));
            applianceRepo.save(new Appliance("Microwave Oven", "1000W countertop microwave oven with sensor cooking", "MW-4001"));
            applianceRepo.save(new Appliance("Stove", "Gas stove with 4 burners and convection oven", "ST-6001"));
            applianceRepo.save(new Appliance("Freezer", "Upright freezer, 200L capacity with fast-freeze function", "FZ-7001"));
            applianceRepo.save(new Appliance("Toaster Oven", "Compact toaster oven with air fry and rotisserie", "TO-8001"));
            applianceRepo.save(new Appliance("Coffee Maker", "Programmable 12-cup drip coffee maker with thermal carafe", "CM-9001"));
            applianceRepo.save(new Appliance("Blender", "High-performance 1500W blender with 10 speed settings", "BL-10001"));

            // Seed appliances — Laundry
            applianceRepo.save(new Appliance("Washing Machine", "Front-load washing machine, 8kg capacity with steam wash", "WM-2001"));
            applianceRepo.save(new Appliance("Dryer", "Electric dryer with sensor dry and wrinkle prevention", "DR-11001"));
            applianceRepo.save(new Appliance("Iron", "Steam iron with ceramic soleplate and auto shut-off", "IR-12001"));

            // Seed appliances — Climate & Comfort
            applianceRepo.save(new Appliance("Air Conditioner", "Split-type air conditioner, 12000 BTU with inverter tech", "AC-5001"));
            applianceRepo.save(new Appliance("Space Heater", "Ceramic tower heater with thermostat and remote control", "SH-13001"));
            applianceRepo.save(new Appliance("Air Purifier", "HEPA air purifier for rooms up to 500 sq ft", "AP-14001"));
            applianceRepo.save(new Appliance("Dehumidifier", "Portable dehumidifier, 50-pint capacity with auto drain", "DH-15001"));
            applianceRepo.save(new Appliance("Ceiling Fan", "52-inch ceiling fan with LED light and remote control", "CF-16001"));

            // Seed appliances — Cleaning
            applianceRepo.save(new Appliance("Robot Vacuum", "Smart robot vacuum with mapping and self-emptying base", "RV-17001"));
            applianceRepo.save(new Appliance("Steam Mop", "Lightweight steam mop with adjustable steam levels", "SM-18001"));

            // Seed appliances — Entertainment & Smart Home
            applianceRepo.save(new Appliance("Smart Speaker", "Voice-controlled smart speaker with premium sound", "SS-19001"));
            applianceRepo.save(new Appliance("Water Heater", "Tankless electric water heater, 18kW for whole house", "WH-20001"));

            // Seed purchases (user-1 owns 5 appliances, user-2 owns 3)
            purchaseRepo.save(new Purchase("user-1", "REF-1001", LocalDate.of(2025, 1, 15)));
            purchaseRepo.save(new Purchase("user-1", "WM-2001", LocalDate.of(2025, 3, 20)));
            purchaseRepo.save(new Purchase("user-1", "MW-4001", LocalDate.of(2025, 5, 10)));
            purchaseRepo.save(new Purchase("user-1", "AC-5001", LocalDate.of(2025, 7, 2)));
            purchaseRepo.save(new Purchase("user-1", "RV-17001", LocalDate.of(2025, 9, 18)));
            purchaseRepo.save(new Purchase("user-2", "DW-3001", LocalDate.of(2025, 2, 28)));
            purchaseRepo.save(new Purchase("user-2", "DR-11001", LocalDate.of(2025, 4, 5)));
            purchaseRepo.save(new Purchase("user-2", "CF-16001", LocalDate.of(2025, 6, 12)));

            System.out.println("✅ Seed data loaded: " + applianceRepo.count() + " appliances, " + purchaseRepo.count() + " purchases");
        };
    }
}
