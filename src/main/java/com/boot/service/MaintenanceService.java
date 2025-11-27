package com.boot.service;

import com.boot.dto.ConsumableItemDTO;
import com.boot.dto.ConsumableLogDTO;
import com.boot.dto.MypageDTO;
import com.boot.dto.RepairHistoryDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MaintenanceService {
    List<MypageDTO> getMyCars(String accountId);
    List<RepairHistoryDTO> getRepairHistory(String car_number);
    RepairHistoryDTO addRepairHistory(RepairHistoryDTO repairHistoryDTO);
    List<ConsumableItemDTO> getAllConsumableItems();
    List<ConsumableLogDTO> getConsumableLogs(String car_number);
    ConsumableLogDTO addConsumableLog(ConsumableLogDTO consumableLogDTO);
    void deleteRepairHistory(int repair_id);
    void deleteConsumableLog(int repair_id);
}
