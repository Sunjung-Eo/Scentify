package com.ssafy.scentify.schedule.model.dto;

import java.sql.Time;

import com.ssafy.scentify.combination.model.dto.CombinationDto;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AutoScheduleDto {
	private Integer id;
	private int deviceId;
	private CombinationDto combination;
	private int interval;
	private boolean intervalChange;
	private boolean modeOn;
	private boolean modeChange;
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public void setDeviceId(int deviceId) {
		this.deviceId = deviceId;
	}
	
	public void setCombination(CombinationDto combination) {
		this.combination = combination;
	}
	
	public void setInterval(int interval) {
        if (interval < 0) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.interval = interval;
    }
	
	public void setModeOn(boolean modeOn) {
		this.modeOn = modeOn;
	}
	
	public void setModeChange(boolean modeChange) {
		this.modeChange = modeChange;
	}
}
