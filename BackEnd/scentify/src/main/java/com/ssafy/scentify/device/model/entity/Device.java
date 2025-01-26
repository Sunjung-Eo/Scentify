package com.ssafy.scentify.device.model.entity;

import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Device {
    private Integer id;
    private String serial;
    private String name;
    private String userId;
    private Integer groupId;
    private String ipAddress;
    private Integer roomType;
    private Integer slot1;
    private Integer slot1RemainingRatio;
    private Integer slot2;
    private Integer slot2RemainingRatio;
    private Integer slot3;
    private Integer slot3RemainingRatio;
    private Integer slot4;
    private Integer slot4RemainingRatio;
    private Boolean mode;
    private Float temperature;
    private Integer humidity;
    private Integer defaultCombination;

}

