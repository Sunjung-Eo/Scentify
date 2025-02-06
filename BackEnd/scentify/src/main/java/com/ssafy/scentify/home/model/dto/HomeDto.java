package com.ssafy.scentify.home.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HomeDto {
    
	@Data
	public static class HomeResponseDto {
	    private UserHomeDto user;
	    private Map<Integer, String> deviceIdsAndNames;
	    private DeviceHomeDto mainDevice;
	    private List<AutoScheduleHomeDto> autoSchedules;
	    private List<CustomScheduleHomeDto> customSchedules;
	}
	
	@Data
    public static class CustomScheduleListResponseDto {
    	private List<CustomScheduleHomeDto> customSchedules;
	}
	
	@Data
    public static class AutoSchedulesListResponseDto {
    	private List<AutoScheduleHomeDto> autoSchedules;
	}

	@Data
	public static class UserHomeDto {
	    private String nickname;
	    private int imgNum;
	    private Integer mainDeviceId;
	}
	
	@Data
	public static class DeviceHomeDto {
	    private int id;
	    private String name;
	    private int groupId;
	    private int roomType;
	    private int slot1;
	    private int slot1RemainingRatio;
	    private int slot2;
	    private int slot2RemainingRatio;
	    private int slot3;
	    private int slot3RemainingRatio;
	    private int slot4;
	    private int slot4RemainingRatio;
	    private int mode;
	    private float temperature;
	    private int humidity;
	    private int defaultCombination;
	}
	
	@Data
	public static class AutoScheduleHomeDto {
	    private int id;
	    private int combinationId;
	    private Integer subMode; 
	    private Integer type;
	    private Integer interval;
	    private int modeOn;
	}
	
	@Data
	public static class CustomScheduleHomeDto {
	    private int id;
	    private String name;
	    private int combinationId;
	    private String combinationName;
	    @JsonProperty("isFavorite") 
	    private boolean isFavorite;
	    private int day;
	    private String startTime;
	    private String endTime;
	    private int interval;
	    private boolean modeOn;
	}
}
