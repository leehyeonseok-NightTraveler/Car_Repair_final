package com.boot.controller;

import com.boot.dto.ConsumableItemDTO;
import com.boot.dto.ConsumableLogDTO;
import com.boot.dto.MypageDTO;
import com.boot.dto.RepairHistoryDTO;
import com.boot.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping("/cars")
    public ResponseEntity<List<MypageDTO>> getMyCars(HttpSession session) {
        String accountId = (String) session.getAttribute("accountId");
        return ResponseEntity.ok(maintenanceService.getMyCars(accountId));
    }

    @GetMapping("/repairHistory/{car_number}")
    public ResponseEntity<List<RepairHistoryDTO>> getRepairHistory(@PathVariable String car_number) {
        return ResponseEntity.ok(maintenanceService.getRepairHistory(car_number));
    }

    @PostMapping("/repair")
    public ResponseEntity<RepairHistoryDTO> repair(@RequestBody RepairHistoryDTO repairHistoryDTO) {
        return ResponseEntity.ok(maintenanceService.addRepairHistory(repairHistoryDTO));
    }


    @GetMapping("/consumables")
    public ResponseEntity<List<ConsumableItemDTO>> getConsumableItems() {
        return ResponseEntity.ok(maintenanceService.getAllConsumableItems());
    }

    @GetMapping("/consumable/log/{car_number}")
    public ResponseEntity<List<ConsumableLogDTO>> getConsumableLogs(@PathVariable String car_number) {
        return ResponseEntity.ok(maintenanceService.getConsumableLogs(car_number));
    }

    @PostMapping("/consumable/log")
    public ResponseEntity<ConsumableLogDTO> addConsumableLog(@RequestBody ConsumableLogDTO consumableLogDTO) {
        return ResponseEntity.ok(maintenanceService.addConsumableLog(consumableLogDTO));
    }

    @DeleteMapping("/delete/repairHistory/{repair_id}")
    public ResponseEntity<Void> deleteRepair(@PathVariable int repair_id) {
        maintenanceService.deleteRepairHistory(repair_id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/consumableLog/{repair_id}")
    public ResponseEntity<Void> deleteConsumableLog(@PathVariable int repair_id) {
        maintenanceService.deleteConsumableLog(repair_id);
        return ResponseEntity.ok().build();
    }

}
