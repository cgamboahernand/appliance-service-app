package com.applianceservice.controller;

import com.applianceservice.dto.CreatePurchaseDto;
import com.applianceservice.model.Purchase;
import com.applianceservice.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService service;

    public PurchaseController(PurchaseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Purchase> getAll() {
        return service.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Purchase> getByUserId(@PathVariable String userId) {
        return service.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Purchase> create(@RequestBody CreatePurchaseDto dto) {
        Purchase p = service.purchase(dto.getUserId(), dto.getSerialId());
        return ResponseEntity.status(HttpStatus.CREATED).body(p);
    }

    @GetMapping("/available/{serialId}")
    public ResponseEntity<Boolean> isAvailable(@PathVariable String serialId) {
        return ResponseEntity.ok(service.isAvailable(serialId));
    }
}
