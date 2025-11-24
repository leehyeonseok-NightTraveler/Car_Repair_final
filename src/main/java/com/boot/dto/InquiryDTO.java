package com.boot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InquiryDTO {
    private int inquiry_no;
    private String inquiry_title;
    private String inquiry_content;
    private String customer_id;
    private String customer_name;
    private String customer_phone;
    private String customer_email;
    private String inquiry_created;
    private String inquiry_status;
    private String reply_content;
    private Timestamp reply_created;
}
