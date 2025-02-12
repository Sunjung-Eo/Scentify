package com.ssafy.scentify.websocket.model.dto;

import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class WebSocketDto {
	
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class TokenRequest {
		private String token;
	}
	
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class ModeChangeRequest {
	    private String type;  
	    private int mode;     
	    private boolean stinkModeOn;
	    private boolean exerciseModeOn;
	    private boolean restModeOn;
	    private boolean simpleDetectionModeOn;
	}
	
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class TempHumRequest {
	    private String token;               
	    private float temperature;   
	    private int humidity;    
	}
	
	@Data
	@AllArgsConstructor
	public static class Response {
        private int status;
    }
	
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CapsuleInfoRequest {
        private Integer slot1;
        private Integer slot2;
        private Integer slot3;
        private Integer slot4;
    }
	
	@Data
    @NoArgsConstructor
    public static class CapsuleRemainingRequest { 
        private String token;
    	private int slot1RemainingRatio;
        private int slot2RemainingRatio;
        private int slot3RemainingRatio;
        private int slot4RemainingRatio;
    }
	
	@Data
	@NoArgsConstructor
	public static class CustomScheduleRequest {
		private int id;
		private int deviceId;
	    private Time startTime;
	    private Time endTime;
	    private int interval;
	    private boolean modeOn;
	    private Combination combination; 
	    
	    @Data
	    public static class Combination {
	    	private int choice1; // NOT NULL
    	    private int choice1Count;
    	    
    	    private Integer choice2; // NULL 허용
    	    private Integer choice2Count;
    	    
    	    private Integer choice3; // NULL 허용
    	    private Integer choice3Count;
    	    
    	    private Integer choice4; // NULL 허용
    	    private Integer choice4Count;
	    }
	}
	
	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CombinationRequest {
		private String token;
		private int combinationId;
	}
}
