package com.ssafy.scentify.websocket;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.common.util.CodeProvider;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.DeviceService;
import com.ssafy.scentify.home.model.dto.HomeDto.AutoScheduleHomeDto;
import com.ssafy.scentify.schedule.model.dto.AutoScheduleDto;
import com.ssafy.scentify.schedule.model.dto.CustomScheduleDto;
import com.ssafy.scentify.schedule.service.AutoScheduleService;
import com.ssafy.scentify.schedule.service.CustomScheduleService;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleInfoRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleRemainingRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CombinationRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest.Combination;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TokenRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TempHumRequest;


import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class WebSocketController {
	
	private final AutoScheduleService autoScheduleService;
	private final DeviceService deviceService;
	private final CustomScheduleService customScheduleService;
	private final CombinationService combinationService;
	private final TokenProvider tokenProvider;
	private final CodeProvider codeProvider;
	private final SimpMessagingTemplate template;
	
	public WebSocketController(AutoScheduleService autoScheduleService, DeviceService deviceService, CustomScheduleService customScheduleService, CombinationService combinationService, TokenProvider tokenProvider, CodeProvider codeProvider, SimpMessagingTemplate template) {
		this.autoScheduleService = autoScheduleService;
		this.deviceService = deviceService;
		this.customScheduleService = customScheduleService;
		this.combinationService = combinationService;
		this.tokenProvider = tokenProvider;
		this.codeProvider = codeProvider;
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
	        id = Integer.parseInt(tokenProvider.getDeviceId(token));
	                                                                                                                                                                                                                                                                                                        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }

	    deviceService.updateTempHum(id, request);
	    log.info("Data processed for id: {}", id);
	}
	
	// API 16번 : RB 캡슐 정보 송신
	@MessageMapping("/DeviceStatus/Capsule/Info")
	public void sendCapsuleInfo(@Payload TokenRequest request) {
		String token = request.getToken();
	    Integer id = null;

	    try {
	        tokenProvider.validateJwtToken(token);
	        id = Integer.parseInt(tokenProvider.getDeviceId(token));
	        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }
	    
	    CapsuleInfoRequest infoRequest = deviceService.getCapsuleInfo(id);
		
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
	    int deviceId = scheduleDto.getDeviceId();

	    // 현재 요일의 스케줄만 전송
	    int currentBit = codeProvider.getCurrentDayBit();
	    if ((scheduleDto.getDay() & currentBit) == 0) {
	        return; // 현재 요일이 포함되지 않으면 전송 안 함
	    }

	    // Combination 생성
	    Combination combination = getCombination(scheduleDto);

	    // 요청 객체 생성
	    CustomScheduleRequest scheduleRequest 
	    = new CustomScheduleRequest(scheduleDto.getId(), scheduleDto.getDeviceId(), scheduleDto.getStartTime(), 
	    							scheduleDto.getEndTime(), scheduleDto.getInterval(), scheduleDto.isModeOn(), 
	    							combination);

	    // 메시지 전송
	    template.convertAndSend("/topic/Schedule/Change/" + deviceId, scheduleRequest);
	}

	// Combination 객체 생성 메서드
	private Combination getCombination(CustomScheduleDto scheduleDto) {
	    Integer combinationId = scheduleDto.getCombination().getId();

	    if (combinationId == null) {
	        return new Combination(
	            scheduleDto.getCombination().getChoice1(), scheduleDto.getCombination().getChoice1Count(),
	            scheduleDto.getCombination().getChoice2(), scheduleDto.getCombination().getChoice2Count(),
	            scheduleDto.getCombination().getChoice3(), scheduleDto.getCombination().getChoice3Count(),
	            scheduleDto.getCombination().getChoice4(), scheduleDto.getCombination().getChoice4Count()
	        );
	    }

	    Combination combination = combinationService.getSocketCombinationById(combinationId);
	    return combination;
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
	public void sendDailyCustomSchedules(int deviceId, List<CustomScheduleRequest> schedules) {
		String destination = "/topic/Schedule/Initial/" + deviceId;
        Map<String, Object> message = new HashMap<>();
        message.put("schedules", schedules);
        template.convertAndSend(destination, message);
        log.info("자정 배치: deviceId={} 에 스케줄 {}개 전송", deviceId, schedules.size());
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
	
	// API 72번 : 커스텀 스케줄 정보 요청
	@MessageMapping("/Schedule/Initial")
	public void sendCustomSchedules(@Payload TokenRequest request) {
		String token = request.getToken();
	    Integer id = null;

	    try {
	        tokenProvider.validateJwtToken(token);
	        id = Integer.parseInt(tokenProvider.getDeviceId(token));
	        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }
	    
	    // 현재 요일의 스케줄만 전송
	    int currentBit = codeProvider.getCurrentDayBit();
	    List<CustomScheduleRequest> schedules = customScheduleService.getCustomSchedules(id, currentBit);
	    
	    // 요청 객체 생성
 		Map<String, List<CustomScheduleRequest>> response = new HashMap<>();
 		response.put("schedules", schedules);
 		
 		// 메시지 전송
        template.convertAndSend("/topic/Schedule/Initial/" + id, response);
        log.info("Data processed for id: {}", id); 
	}
	
	// API 54번 : 즉시 분사
	public void sendRemoteOperation(int deviceId, CombinationDto combinationDto) {
		// 메세지 전송
		template.convertAndSend("/topic/Remote/Operation/" + deviceId, combinationDto);
		log.info("Data processed for id: {}", deviceId);  
	}
	
	// API 74번 : 자동화 스케줄 정보 요청
	@MessageMapping("/Auto/Schedule/Initial")
	public void sendAutoSchedules(@Payload TokenRequest request) {
		String token = request.getToken();
	    Integer id = null;

	    try {
	        tokenProvider.validateJwtToken(token);
	        id = Integer.parseInt(tokenProvider.getDeviceId(token));
	        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }
	    
	    List<AutoScheduleHomeDto> schedules = autoScheduleService.getSchedulesByDeviceId(id);
	    Map<String, List<AutoScheduleHomeDto>> response = new HashMap<>();
 		response.put("schedules", schedules);
 		
 		// 메세지 전송
		template.convertAndSend("/topic/Auto/Schedule/Initial/" + id, response);
		log.info("Data processed for id: {}", id);  
	}
	
	// API 41번 : 자동화 모드 향기 정보 요청
	@MessageMapping("/DeviceStatus/Sensor")
	public void sendCombination(@Payload CombinationRequest request) {
		String token = request.getToken();
	    Integer id = null;

	    try {
	        tokenProvider.validateJwtToken(token);
	        id = Integer.parseInt(tokenProvider.getDeviceId(token));
	        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return;
	    }
	    
	    Combination combination = combinationService.getSocketCombinationById(id);
	    Map<String, Combination> response = new HashMap<>();
 		response.put("combination", combination);
 		
 		// 메세지 전송
		template.convertAndSend("/topic/Auto/Operation/" + id, response);
		log.info("Data processed for id: {}", id); 		
	}
	
	// API 45번 : 자동화 모드 조합 수정 정보 전송
	public void sendCombinationUpdate(int deviceId, int scheduleId, int combinatonId) {
		Map<String, Integer> response = new HashMap<>();
		response.put("id", scheduleId);
		response.put("combinationId", combinatonId);
		
		// 메세지 전송
		template.convertAndSend("/topic/Combination/Change/" + deviceId, response);
		log.info("Data processed for id: {}", deviceId); 	
	}
	
	// API 50번 : 자동화 모드 인터벌 수정 정보 전송
	public void sendIntervalUpdate(int deviceId, int scheduleId, int interval) {
		Map<String, Integer> response = new HashMap<>();
		response.put("id", scheduleId);
		response.put("interval", interval);
		
		// 메세지 전송
		template.convertAndSend("/topic/Interval/Change/" + deviceId, response);
		log.info("Data processed for id: {}", deviceId); 
	}
	
	// API 51번 : 자동화 모드 modeOn 수정 정보 전송
	public void sendUpdateModeOn(int deviceId, int scheduleId, boolean modeOn) {
		Map<String, Object> response = new HashMap<>();
		response.put("id", scheduleId);
		response.put("modeOn", modeOn);
		
		// 메세지 전송
		template.convertAndSend("/topic/Mode/Change/" + deviceId, response);
		log.info("Data processed for id: {}", deviceId); 
	}
	
	// 하나의 메서드에서 정보를 받아와서 분기 처리
	public void sendAutoModeUpdate(AutoScheduleDto autoScheduleDto, int combinationId, boolean combinationChange) {
		// 웹 소켓 통신으로 수정되었음을 전달 필요
		int deviceId = autoScheduleDto.getDeviceId();
		int scheduleId = autoScheduleDto.getId();
		
		if (combinationChange == true) {
			sendCombinationUpdate(deviceId, scheduleId, combinationId);
		}
		
		if (autoScheduleDto.getIntervalChange() != null && autoScheduleDto.getIntervalChange() == true) {
			sendIntervalUpdate(deviceId, scheduleId, autoScheduleDto.getInterval());
		}
					
		if (autoScheduleDto.isModeChange()) {
			sendUpdateModeOn(deviceId, scheduleId, autoScheduleDto.isModeOn());
		}
	}
}
