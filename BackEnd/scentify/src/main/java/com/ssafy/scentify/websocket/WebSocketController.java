package com.ssafy.scentify.websocket;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.DeviceService;
import com.ssafy.scentify.schedule.model.dto.CustomScheduleDto;
import com.ssafy.scentify.schedule.service.CustomScheduleService;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleInfoRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleRemainingRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest.Combination;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TokenRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TempHumRequest;


import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class WebSocketController {
	
	private final DeviceService deviceService;
	private final CustomScheduleService customScheduleService;
	private final TokenProvider tokenProvider;
	private final SimpMessagingTemplate template;
	
	public WebSocketController(DeviceService deviceService, CustomScheduleService customScheduleService, TokenProvider tokenProvider, SimpMessagingTemplate template) {
		this.deviceService = deviceService;
		this.customScheduleService = customScheduleService;
		this.tokenProvider = tokenProvider;
		this.template = template;
	}
	
	// 디바이스 아이디를 송신
	@MessageMapping("/DeviceInfo/Id")
	public void sendDeviceId(@Payload TokenRequest request) {
	    String token = request.getToken();
	    String serial = "";

	    try {
	        tokenProvider.validateJwtToken(token);
	        serial = tokenProvider.getSerial(token);
	                                                                                                                                                                                                                                                                                                        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }
	    
	    int id = deviceService.selectDeviceIdBySerial(serial);
	    log.info("Data processed for id: {}", id);
	    
	    Map<String, Integer> response = new HashMap<>();
	    response.put("id", id);
	    template.convertAndSend("/topic/DeviceInfo/Id/" + serial, response);
	}
	
	
	// API 15번 : RB 온습도 정보 수신
	@MessageMapping("/DeviceStatus/Sensor/TempHum")
	public void handleSensorData(@Payload TempHumRequest request) {
	    String token = request.getToken();
	    Integer id = null;

	    try {
	        tokenProvider.validateJwtToken(token);
	        id = Integer.parseInt(tokenProvider.getId(token));
	                                                                                                                                                                                                                                                                                                        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }

	    deviceService.updateTempHum(id, request);
	    log.info("Data processed for id: {}", id);
	}
	
	// API 16번 : RB 캡슐 정보 송신
	public void sendCapsuleInfo(int id, CapsuleInfoRequest infoRequest) {
        // 메시지 전송
        template.convertAndSend("/topic/DeviceStatus/Capsule/Info/" + id, infoRequest);
        log.info("Data processed for id: {}", id);
	}
	
	// API 17번 : RB 캡슐 잔여량 수신
	@MessageMapping("/DeviceStatus/Capsule/Remainder")
	public void handCapsuleRemainer(@Payload CapsuleRemainingRequest request) {
	    String token = request.getToken();
	    Integer id = null;

	    try {
	        tokenProvider.validateJwtToken(token);
	        id = Integer.parseInt(tokenProvider.getDeviceId(token));
	        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }
	    
	    deviceService.updateCapsuleRemaining(id, request);
	    log.info("Data processed for id: {}", id);
	}
	
	// API 76번 : 스케줄, 자동화 모드 정보 전송
	@MessageMapping("/Mode")
	public void sendDeviceMode(@Payload TokenRequest request) {
		String token = request.getToken();
	    Integer id = null;

	    try {
	        tokenProvider.validateJwtToken(token);
	        id = Integer.parseInt(tokenProvider.getDeviceId(token));
	        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }
	    
	    boolean mode = deviceService.getMode(id);
	    Map<String, Boolean> response = new HashMap<>();
	    response.put("mode", mode);
	    
	    // 메시지 전송
        template.convertAndSend("/topic/Mode" + id, response);
	    log.info("Data processed for id: {}", id);    
	}
	
	// API 34번 : 사용자가 custom 스케줄 수정 시 RB에 전송하는 메서드
	public void sendCustomScheduleUpdate(CustomScheduleDto scheduleDto) {
		// 요청 객체 생성
		int deviceId = scheduleDto.getDeviceId();
		CustomScheduleRequest scheduleRequest = new CustomScheduleRequest();
		scheduleRequest.setId(scheduleDto.getId());
		scheduleRequest.setStartTime(scheduleDto.getStartTime());
		scheduleRequest.setEndTime(scheduleDto.getEndTime());
		scheduleRequest.setInterval(scheduleDto.getInterval());
		scheduleRequest.setModeOn(scheduleDto.isModeOn());
		scheduleRequest.setCombination(null);
		
		if (scheduleDto.getCombination().getId() == null) {
			Combination combination = new Combination();
			combination.setChoice1(scheduleDto.getCombination().getChoice1());
			combination.setChoice1Count(scheduleDto.getCombination().getChoice1Count());
			combination.setChoice2(scheduleDto.getCombination().getChoice2());
			combination.setChoice2Count(scheduleDto.getCombination().getChoice2Count());
			combination.setChoice3(scheduleDto.getCombination().getChoice3());
			combination.setChoice3Count(scheduleDto.getCombination().getChoice3Count());
			combination.setChoice4(scheduleDto.getCombination().getChoice4());
			combination.setChoice4Count(scheduleDto.getCombination().getChoice4Count());
			scheduleRequest.setCombination(combination);
		}

		// 메시지 전송
        template.convertAndSend("/topic/Schedule/Change/" + deviceId, scheduleRequest);
	}
	
	
	// API 36번 : 사용자가 custom 스케줄 삭제 시 RB에 전송하는 메서드
	public void sendCustomScheduleDelete(Map<String, Integer> deleteScheduleMap) {
		// 요청 객체 생성
		int deviceId = deleteScheduleMap.get("deviceId");
		Map<String, Integer> scheduleRequest = new HashMap<>();
		scheduleRequest.put("scheduleId", deleteScheduleMap.get("id"));
		
		// 메시지 전송
        template.convertAndSend("/topic/Schedule/Delete/" + deviceId, scheduleRequest);
	}
	
	// API 38번 : 매일 자정 custom 스케줄 배치
	@Scheduled(cron = "0 0 0 * * ?") 
	public void sendDailyCustomSchedules() {
		Map<Integer, List<CustomScheduleRequest>> groupedSchedules = customScheduleService.getGroupedSchedules();
		
		groupedSchedules.forEach((deviceId, schedules) -> {
            String destination = "/topic/Schedule/Initial/" + deviceId;
            Map<String, Object> message = new HashMap<>();
            message.put("schedules", schedules);
            template.convertAndSend(destination, message);
            log.info("자정 배치: deviceId={} 에 스케줄 {}개 전송", deviceId, schedules.size());
        });
	}

	// API 30번 : 모드 변경 시 RB에 정보를 전달하는 메서드
	public void sendDeviceModeUpdate(Map<String, Object> modeInfoMap) {
		// 디바이스 아이디와 모드 추출
		int deviceId = (int) modeInfoMap.get("deviceId");
		boolean mode = (boolean) modeInfoMap.get("mode");
        
        // 요청 객체 생성
		Map<String, Boolean> modeRequest = new HashMap<>();
		modeRequest.put("mode", mode);
		
		// 메시지 전송
        template.convertAndSend("/topic/Mode/Change/" + deviceId, modeRequest);
	}
	
	// API 54번 : 즉시 분사
	public void sendRemoteOperation(int deviceId, CombinationDto combinationDto) {
		// 메세지 전송
		template.convertAndSend("/topic/Remote/Operation/" + deviceId, combinationDto);
		log.info("Data processed for id: {}", deviceId);  
	}
}
