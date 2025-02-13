package com.ssafy.scentify.schedule.model.dto;

import java.sql.Time;

import lombok.Data;

@Data
public class DeleteScheduleDto {
    private int day; 
    private Time startTime;
    private Time endTime;
}
