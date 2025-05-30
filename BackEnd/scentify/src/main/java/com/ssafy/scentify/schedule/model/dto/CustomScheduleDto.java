package com.ssafy.scentify.schedule.model.dto;

import java.sql.Time;

import com.ssafy.scentify.combination.model.dto.CombinationDto;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CustomScheduleDto {
	private Integer id;
    private String name;
    private int deviceId;
    private int day; 
    private CombinationDto combination; 
    private Time startTime;
    private Time endTime;
    private int interval;
    private boolean modeOn;

	public void setId(Integer id) {
		this.id = id;
	}
    
    public void setName(String name) {
        if (name == null || name.length() < 1 || name.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.name = name;
    }

    public void setDeviceId(int deviceId) {
        this.deviceId = deviceId;
    }
    
    public void setDay(int day) {
        if (day <= 0 || day > 0b1111111) { // 7비트 이내 값이어야 함 (0 ~ 127)
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.day = day;
    }

    public void setStartTime(Time startTime) {
        if (startTime == null) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.startTime = startTime;
    }

    public void setEndTime(Time endTime) {
        if (endTime == null) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        if (this.startTime != null && endTime.before(this.startTime)) {
            throw new IllegalArgumentException("endTime은 startTime 이후여야 합니다.");
        }
        this.endTime = endTime;
    }

    public void setInterval(int interval) {
        if (interval <= 0) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.interval = interval;
    }

	public void setModeOn(boolean modeOn) {
		this.modeOn = modeOn;
	}
}
