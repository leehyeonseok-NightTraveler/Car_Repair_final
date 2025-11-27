// 1. 정비 이력 DTO
package com.boot.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.Date;

@Data
public class RepairHistoryDTO {
    private int repair_id;
    private String car_number;
    private Date repair_date;
    private int mileage;
    private String description;
    private String shop_name;
    private int cost;
    private String memo;
}