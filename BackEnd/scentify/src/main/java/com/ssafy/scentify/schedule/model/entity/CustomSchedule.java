package com.ssafy.scentify.schedule.model.entity;

import java.sql.*;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CustomSchedule {
    private Integer id;
    private String name;
    private int deviceId;
    private String userId;
    private int combinationId;
    private String combinationName;
    private int day;
    private Time startTime;
    private Time endTime;
    private int interval;
    private Boolean modeOn;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    
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
    
    
    public void setUserId(String userId) {
        if (userId == null || userId.isBlank() || userId.contains(" ") || userId.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.userId = userId;
    }

    public void setCombinationId(int combinationId) {
        if (combinationId < 0) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.combinationId = combinationId;
    }

    public void setCombinationName(String combinationName) {
        if (combinationName == null || combinationName.length() < 1 || combinationName.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.combinationName = combinationName;
    }

    public void setDay(int day) {
        if (day < 0 || day > 0b1111111) { // 7비트 이내 값이어야 함 (0 ~ 127)
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
        if (interval < 0) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.interval = interval;
    }

	public void setModeOn(Boolean modeOn) {
		this.modeOn = modeOn;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public void setUpdatedAt(Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}
}

