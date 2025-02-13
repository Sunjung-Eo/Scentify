package com.ssafy.scentify.websocket;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.common.util.CodeProvider;
import com.ssafy.scentify.device.DeviceService;
import com.ssafy.scentify.schedule.model.dto.AutoScheduleDto;
import com.ssafy.scentify.schedule.model.dto.CustomScheduleDto;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleInfoRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TokenRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest.Combination;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class WebSocketService {
	
	private final WebSocketSessionManager sessionManager;
	private final CombinationService combinationService;
	private final DeviceService deviceService;
	private final SimpMessagingTemplate template;
	private final CodeProvider codeProvider;
	
	public WebSocketService(WebSocketSessionManager sessionManager, DeviceService deviceService, CombinationService combinationService, SimpMessagingTemplate template, CodeProvider codeProvider) {
		this.sessionManager = sessionManager;
		this.combinationService = combinationService;
		this.deviceService = deviceService;
		this.template = template;
		this.codeProvider = codeProvider;
	}
	
	// 기기 등록 시 캡슐 정보 자동으로 보내줌
	public void sendCapsuleInfo(int deviceId, CapsuleInfoRequest infoRequest) {	    
		// 메시지 전송
        template.convertAndSend("/topic/DeviceStatus/Capsule/Info/" + deviceId, infoRequest);
        log.info("Data processed for id: {}", deviceId);
	}
	
	// 오늘 날짜에 해당하는 스케줄을 생성했을 때 RB에 전송하는 메서드 
	public void sendCustomScehdule(CustomScheduleDto customScheduleDto) {	    
		// 메세지 준비
		int deviceId = customScheduleDto.getDeviceId();
		Map<String, Object> message = new HashMap<>();
        message.put("schedules", customScheduleDto);
        
        // 메세지 전송
        template.convertAndSend("/topic/Schedule/Add/" + deviceId, message);
        log.info("Data processed for id: {}", deviceId);
	}
	
	// API 34번 : 사용자가 custom 스케줄 수정 시 RB에 전송하는 메서드
	public void sendCustomScheduleUpdate(CustomScheduleDto scheduleDto) {
	    int deviceId = scheduleDto.getDeviceId();

	    // Combination 생성
	    Combination combination = getCombination(scheduleDto);

	    // 요청 객체 생성
	    CustomScheduleRequest scheduleRequest = new CustomScheduleRequest();
	    scheduleRequest.setId(scheduleDto.getId());
	    scheduleRequest.setDeviceId(scheduleDto.getDeviceId());
	    scheduleRequest.setStartTime(scheduleDto.getStartTime());
	    scheduleRequest.setEndTime(scheduleDto.getEndTime());
	    scheduleRequest.setInterval(scheduleDto.getInterval());
	    scheduleRequest.setModeOn(scheduleDto.isModeOn());
	    scheduleRequest.setCombination(combination);
	    
	    // 키값으로 매핑해서 전송
	    Map<String, CustomScheduleRequest> response = new HashMap<>();
 		response.put("schedule", scheduleRequest);

	    // 메시지 전송
	    template.convertAndSend("/topic/Schedule/Change/" + deviceId, response);
	}

	// Combination 객체 생성 메서드
	public Combination getCombination(CustomScheduleDto scheduleDto) {
	    Integer combinationId = scheduleDto.getCombination().getId();
	    
	    if (combinationId == null) {
	        Combination combination = new Combination();
	        CombinationDto combinationInfo = scheduleDto.getCombination();
	        
	        combination.setChoice1(combinationInfo.getChoice1());
	        combination.setChoice1Count(combinationInfo.getChoice1Count());
	        combination.setChoice2(combinationInfo.getChoice2());
	        combination.setChoice2Count(combinationInfo.getChoice2Count());
	        combination.setChoice3(combinationInfo.getChoice3());
	        combination.setChoice3Count(combinationInfo.getChoice3Count());
	        combination.setChoice4(combinationInfo.getChoice4());
	        combination.setChoice4Count(combinationInfo.getChoice4Count());
	        
	    	return combination;
	    }

	    Combination combination = combinationService.getSocketCombinationById(combinationId);
	    return combination;
	}
	
	// API 36번 : 사용자가 custom 스케줄 삭제 시 RB에 전송하는 메서드
	public void sendCustomScheduleDelete(Map<String, Object> deleteScheduleMap) {
		// 요청 객체 생성
		int deviceId = (int) deleteScheduleMap.get("deviceId");
		Map<String, Integer> scheduleRequest = new HashMap<>();
		scheduleRequest.put("scheduleId", (int) deleteScheduleMap.get("id"));
		
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
        
        // 응답 객체 생성
		Map<String, Boolean> modeRequest = new HashMap<>();
		modeRequest.put("mode", mode);
		
		// 메시지 전송
        template.convertAndSend("/topic/Mode/Change/" + deviceId, modeRequest);
        log.info("Data processed for id: {}", deviceId);  
	}
	
	// API 54번 : 즉시 분사
	public void sendRemoteOperation(int deviceId, CombinationDto combinationDto) {
		// 메세지 전송
		template.convertAndSend("/topic/Remote/Operation/" + deviceId, combinationDto);
		log.info("Data processed for id: {}", deviceId);  
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
		template.convertAndSend("/topic/Auto/Mode/Change/" + deviceId, response);
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
	
	// API 67번 : 웹소켓 통신 종료 요청
	public void closeConnection(int deviceId, String serial) {
		// 메세지 전송
		template.convertAndSend("/topic/Connection/Close/" + deviceId, "Close");
		log.info("Data processed for id: {}", deviceId);
		
		sessionManager.removeSession(serial);
	}
}
