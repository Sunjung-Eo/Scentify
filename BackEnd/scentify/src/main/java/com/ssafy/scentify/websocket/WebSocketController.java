package com.ssafy.scentify.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.DeviceService;
import com.ssafy.scentify.schedule.model.dto.CustomScheduleDto;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleInfoRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleRemainingRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.ModeChangeRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TempHumRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.UpdateCustomScheduleRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.UpdateCustomScheduleRequest.Combination;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.Response;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class WebSocketController {
	
	private final DeviceService deviceService;
	private final TokenProvider tokenProvider;
	private final SimpMessagingTemplate template;
	
	public WebSocketController(DeviceService deviceService, TokenProvider tokenProvider, SimpMessagingTemplate template) {
		this.deviceService = deviceService;
		this.tokenProvider = tokenProvider;
		this.template = template;
	}
	
	// API 15번 : RB 온습도 정보 수신
	@MessageMapping("/DeviceStatus/Sensor/TempHum")
	@SendToUser("/queue/DeviceStatus/Sensor/TempHum")
	public Response handleSensorData(@Payload TempHumRequest request) {
	    String token = request.getToken();
	    int id;

	    try {
	        tokenProvider.validateJwtToken(token);
	        id = Integer.parseInt(tokenProvider.getId(token));
	        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return new Response(400);
	    }

	    deviceService.updateTempHum(id, request);
	    log.info("Data processed for serial: {}", id);
		
	    // 특정 사용자에게만 메시지 전송
		return new Response(200);
	}
	
	// API 16번 : RB 캡슐 정보 송신
	public void sendCapsuleInfo(int id, CapsuleInfoRequest infoRequest) {
        // 메시지 전송
        template.convertAndSend("/topic/DeviceStatus/Capsule/Info/" + id, infoRequest);
    }
	
	// API 17번 : RB 캡슐 잔여량 수신
	@MessageMapping("/DeviceStatus/Capsule/Remainder")
	@SendToUser("/queue/DeviceStatus/Capsule/Remainder/")
	public Response handCapsuleRemainer(@Payload CapsuleRemainingRequest request) {
	    String token = request.getToken();
	    String serial;

	    try {
	        tokenProvider.validateJwtToken(token);
	        serial = tokenProvider.getSerial(token);
	        
	    } catch (ExpiredJwtException e) {
	        log.info("Token 만료됨");
	        return new Response(400);
	    }

	    deviceService.updateCapsuleRemaining(serial, request);
	    log.info("Data processed for serial: {}", serial);

	    // 특정 사용자에게만 메시지 전송
	    return new Response(200);
	}
	
	// API 34번 : 사용자가 custom 스케줄 수정 시 RB에 전송하는 메서드
	public void sendScheduleUpdate(CustomScheduleDto scheduleDto) {
		// 요청 객체 생성
		int deviceId = scheduleDto.getDeviceId();
		UpdateCustomScheduleRequest scheduleRequest = new UpdateCustomScheduleRequest();
		scheduleRequest.setId(scheduleDto.getId());
		scheduleRequest.setStartTime(scheduleDto.getStartTime());
		scheduleRequest.setEndTime(scheduleDto.getEndTime());
		scheduleRequest.setInterval(scheduleDto.getInterval());
		scheduleRequest.setModeOn(scheduleDto.isModeOn());
		scheduleRequest.setCombination(null);
		
		if (scheduleDto.getCombination().getId() == null) {
			Combination combination = new Combination(scheduleDto.getCombination().getChoice1(), scheduleDto.getCombination().getChoice1Count(),
													  scheduleDto.getCombination().getChoice2(), scheduleDto.getCombination().getChoice2Count(), 
													  scheduleDto.getCombination().getChoice3(), scheduleDto.getCombination().getChoice3Count(),
													  scheduleDto.getCombination().getChoice4(), scheduleDto.getCombination().getChoice4Count());
			scheduleRequest.setCombination(combination);
		}

		// 메시지 전송
        template.convertAndSend("/topic/Schedule/Change/" + deviceId, scheduleRequest);
	}
}
