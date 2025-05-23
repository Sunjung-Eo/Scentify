package com.ssafy.scentify.schedule.model.entity;

import java.sql.*;
import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AutoSchedule {
    private Integer id;
    private int deviceId;
    private int combinationId;
    private int subMode;
    private Integer type;
    private int interval;
    private Boolean modeOn;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    

	public void setId(Integer id) {
		this.id = id;
	}

    public void setDeviceId(int deviceId) {
        this.deviceId = deviceId;
    }

    public void setCombinationId(int combinationId) {
        if (combinationId < 0) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.combinationId = combinationId;
    }

    public void setSubMode(int subMode) {
        if (subMode < 0 || subMode > 2) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.subMode = subMode;
    }

    public void setType(Integer type) {
        if (type != null && type != 0 && type != 1) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.type = type;
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