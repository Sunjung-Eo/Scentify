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
	    
	    Combination combination = combinationService.getSocketCombinationById(request.getCombinationId());
	    Map<String, Combination> response = new HashMap<>();
 		response.put("combination", combination);
 		
 		// 메세지 전송
		template.convertAndSend("/topic/Auto/Operation/" + id, response);
		log.info("Data processed for id: {}", id); 		
	}
}
