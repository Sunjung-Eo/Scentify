package com.ssafy.scentify.schedule.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.home.model.dto.HomeDto.AutoScheduleHomeDto;
import com.ssafy.scentify.home.model.dto.HomeDto.AutoSchedulesListResponseDto;
import com.ssafy.scentify.home.model.dto.HomeDto.CustomScheduleListResponseDto;
import com.ssafy.scentify.schedule.model.dto.AutoScheduleDto;
import com.ssafy.scentify.schedule.model.dto.UpdateModeDto;
import com.ssafy.scentify.schedule.model.dto.UpdateModeDto.Schedule;
import com.ssafy.scentify.schedule.service.AutoScheduleService;
import com.ssafy.scentify.websocket.WebSocketController;
import com.ssafy.scentify.websocket.WebSocketService;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RequestMapping("/v1/auto")
@RestController
public class AutoScheduleController {
	
	private final WebSocketService socketService;
	private final AutoScheduleService autoScheduleService;
	private final CombinationService combinationService;
	
	public AutoScheduleController(WebSocketService socketService, AutoScheduleService autoScheduleService, CombinationService combinationService) {
		this.socketService = socketService;
		this.autoScheduleService = autoScheduleService;
		this.combinationService = combinationService;
	}
	
	// API 39번 : 전체 자동화 모드 조회
	@PostMapping("/all")
	public ResponseEntity<?> getAllAutomationModes(@RequestBody Map<String, Integer> deviceIdMap) {
		try {
			// deviceId 저장 및 유효성 검사
			Integer deviceId = deviceIdMap.get("deviceId");
			if (deviceId == null ) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			List<AutoScheduleHomeDto> schedules = autoScheduleService.getSchedulesByDeviceId(deviceId);
		
			// 응답 DTO 생성
			AutoSchedulesListResponseDto response = new AutoSchedulesListResponseDto();
			response.setAutoSchedules(schedules);

	        return new ResponseEntity<>(response, HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 42번 : 악취 모드 설정 수정
	@PostMapping("/deodorization/update")
	public ResponseEntity<?> updateDeodorizationMode(@RequestBody AutoScheduleDto autoScheduleDto) {
		try {
			// 향 조합에 변경이 없다면 id가 전달됨
			CombinationDto combination = autoScheduleDto.getCombination();
			Integer combinationId = combination.getId();
			boolean combinationChange = false;
			
			// 향 조합이 변경된 경우 향 조합을 등록
			if (combinationId == null) {
				combination.setName("탈취향");
				combinationId = combinationService.createCombination(combination);	
				if (combinationId  == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }	
				combinationChange = true;
			}
				
			// 악취 모드 업데이트 (불가능 하다면 400 반환)
			if (!autoScheduleService.updateAutoSchedule(autoScheduleDto, combinationId)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
			}
			
			socketService.sendAutoModeUpdate(autoScheduleDto, combinationId, combinationChange);
			
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 46번 : 운동, 휴식 모드 수정
	@PostMapping("/exercise/rest/update")
	public ResponseEntity<?> updateExerciseAndRestMode(@RequestBody UpdateModeDto modeDto) {
		try {
			// 운동 모드 수정
			Schedule exerciseSchedule = modeDto.getExerciseScehdule();
			if (!updateActionSchedule(exerciseSchedule, modeDto.isExerciseIntervalChange(), modeDto.isExerciseModeChange())) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// 휴식 모드 수정
			Schedule restSchedule = modeDto.getRestScehdule();
			if (!updateActionSchedule(restSchedule, modeDto.isRestIntervalChange(), modeDto.isRestModeChange())) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

	// 동작 모드 DB 업데이트 및 RB 정보 전달
	public boolean updateActionSchedule(Schedule schedule, boolean intervalChange, boolean modeChange) {
		if (!autoScheduleService.updateActionSchedule(schedule)) { return false; }
		
		int deviceId = schedule.getDeviceId();
		int scheduleId = schedule.getId();
		if (intervalChange) { socketService.sendIntervalUpdate(deviceId, scheduleId, schedule.getInterval());}
		if (modeChange) { socketService.sendUpdateModeOn(deviceId, scheduleId, schedule.isModeOn()); }
		
		return true;
	}
	
	// API 51번 : 단순 탐지 모드 수정
	@PostMapping("/detection/update")
	public ResponseEntity<?> updateDetectionMode(@RequestBody AutoScheduleDto autoScheduleDto) {
		try {
			// 향 조합에 변경이 없다면 id가 전달됨
			CombinationDto combination = autoScheduleDto.getCombination();
			Integer combinationId = combination.getId();
			boolean combinationChange = false;
			
			// 향 조합이 변경된 경우 향 조합을 등록
			if (combinationId == null) {
				combination.setName("탐지향");
				combinationId = combinationService.createCombination(combination);	
				if (combinationId  == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 	}
				combinationChange = true;
			}
			
			// 탐지 모드 업데이트 (불가능 하다면 400 반환)
			if (!autoScheduleService.updateAutoSchedule(autoScheduleDto, combinationId)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
			}
			
			socketService.sendAutoModeUpdate(autoScheduleDto, combinationId, combinationChange);
			
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
