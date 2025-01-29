package com.ssafy.scentify.websocket.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

public class WebSocketDto {
	
	@Data
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
	@AllArgsConstructor
	public static class CapsuleInfoRequest {
        private int slot1;
        private int slot2;
        private int slot3;
        private int slot4;
    }
	
	@Data
	@AllArgsConstructor
	public static class CapsuleRemainingRequest {
	    private String token;               
	    private int slot1RemainingRatio;   
	    private int slot2RemainingRatio;  
	    private int slot3RemainingRatio;   
	    private int slot4RemainingRatio; 
	}
}
