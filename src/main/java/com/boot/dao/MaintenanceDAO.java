package com.boot.dao;

import com.boot.dto.ConsumableItemDTO;
import com.boot.dto.ConsumableLogDTO;
import com.boot.dto.MypageDTO;
import com.boot.dto.RepairHistoryDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MaintenanceDAO {
    List<MypageDTO> getMyCars(@Param("accountId") String accountId);
    List<RepairHistoryDTO> getRepairHistory(@Param("car_number") String car_number);
    RepairHistoryDTO addRepairHistory(RepairHistoryDTO repairHistoryDTO);
    List<ConsumableItemDTO> getAllConsumableItems();
    List<ConsumableLogDTO> getConsumableLogs(@Param("car_number") String car_number);
    ConsumableLogDTO addConsumableLog(ConsumableLogDTO consumableLogDTO);
    void deleteRepairHistory(@Param("repair_no") int repair_id);
    void deleteConsumableLog(@Param("repair_no") int repair_id);
}
