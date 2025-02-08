package com.ssafy.scentify.schedule.controller;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.common.util.CodeProvider;
import com.ssafy.scentify.home.model.dto.HomeDto.CustomScheduleHomeDto;
import com.ssafy.scentify.home.model.dto.HomeDto.CustomScheduleListResponseDto;
import com.ssafy.scentify.schedule.model.dto.CustomScheduleDto;
import com.ssafy.scentify.schedule.service.CustomScheduleService;
import com.ssafy.scentify.websocket.WebSocketService;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/custom")
@RestController
public class CustomScheduleController {
	
	private final WebSocketService socketService;
	private final CombinationService combinationService;
	private final CustomScheduleService customScheduleService;
	private final CodeProvider codeProvider;
	
	public CustomScheduleController(WebSocketService socketService, CombinationService combinationService, CustomScheduleService customScheduleService, CodeProvider codeProvider) {
		this.socketService = socketService;
		this.combinationService = combinationService;
		this.customScheduleService = customScheduleService;
		this.codeProvider =codeProvider;
	}
	
	// API 31번 : 시간 기반 예약 설정
	@PostMapping("/add")
	public ResponseEntity<?> setCustomSchedule(@RequestBody CustomScheduleDto customScheduleDto) {
		try {
			// 향 조합 등록 실패 시 400 반환
			CombinationDto combination = customScheduleDto.getCombination();
			Integer combinationId = combinationService.createCombination(combination);
			if (combinationId  == null) { 
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
			}
			
			// 커스텀 스케줄 등록 실패 시 400 반환
			if (!customScheduleService.createCustomSchedule(customScheduleDto, combinationId, combination.getName())) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 32번 : 시간 기반 예약 개별 조회
	@PostMapping("/one")
	public ResponseEntity<?> getIndividualCustomSchedule(@RequestBody Map<String, Integer> combinationIdMap) {
		try {
			// 조합 아이디 추출
			Integer combinationId = combinationIdMap.get("combinationId");
			if (combinationId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			// 조합 정보 DB에서 조회 및 추출
			CombinationDto combination = combinationService.getCombinationById(combinationId);
			if (combination == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			// JSON 응답을 위한 Map 생성
		    Map<String, CombinationDto> response = new HashMap<>();
		    response.put("combination", combination);

		    return new ResponseEntity<>(response, HttpStatus.OK); // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 33번 : 시간 기반 예약 수정
	@PostMapping("/update")
	public ResponseEntity<?> updateCustomSchedule(@RequestBody CustomScheduleDto customScheduleDto) {
		try {
			// 향 조합이 바뀌지 않았다면 id 값이 있음
			CombinationDto combination = customScheduleDto.getCombination();
			Integer combinationId = combination.getId();
			
			// 향 조합이 바뀐 경우 새롭게 등록해줌
			if (combinationId == null) {			
				combinationId = combinationService.createCombination(combination);			
				if (combinationId  == null) { 
					return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 	
				}
			}
			
			// 커스텀 스케줄 수정 실패 시 400 반환
			if (!customScheduleService.updateCustomSchedule(customScheduleDto, combinationId, combination.getName())) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			

//			socketService.sendCustomScheduleUpdate(customScheduleDto);
			
			return new ResponseEntity<>(HttpStatus.OK); // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 35번 : 시간 기반 예약 삭제
	@PostMapping("/delete")
	public ResponseEntity<?> deleteCustomSchedule(@RequestBody Map<String, Integer> deleteScheduleMap) {
		try {
			Integer customScheduleId = deleteScheduleMap.get("id");
			Integer deviceId = deleteScheduleMap.get("deviceId");
			
			// 요청 데이터 유효성 검사
			if (customScheduleId == null || deviceId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			// 삭제 전 미리 요일 정보를 조회
			int day = customScheduleService.getDayById(customScheduleId, deviceId);
			
			// 삭제가 이루어지지 않은 경우 400 반환
			if (!customScheduleService.deleteCustomScheduleById(customScheduleId, deviceId)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// 현재 요일의 스케줄만 전송
		    int currentBit = codeProvider.getCurrentDayBit();
		    
		    // 사용자가 선택한 요일 목록에 현재 요일이 포함되어 있는 경우만 실행
		    if ((day & currentBit) != 0) {
//				socketController.sendCustomScheduleDelete(deleteScheduleMap);
		    }

			return new ResponseEntity<>(HttpStatus.OK); // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 37번 : 시간 기반 예약 전체 조회
	@PostMapping("/all")
	public ResponseEntity<?> getAllCustomSchedule(@RequestBody Map<String, Integer> deviceIdMap) {
		try {
			// 기기 아이디 추출
			Integer deviceId = deviceIdMap.get("deviceId");
			if (deviceId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			// DB 스케줄 조회
			List<CustomScheduleHomeDto> schedules = customScheduleService.getSchedulesByDeviceId(deviceId);
			
	        // 응답 DTO 생성
			CustomScheduleListResponseDto response = new CustomScheduleListResponseDto();
			response.setCustomSchedules(schedules);

	        return new ResponseEntity<>(response, HttpStatus.OK); // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 38번 : 매일 자정 custom 스케줄 배치
	@Scheduled(cron = "0 0 0 * * ?") 
	public void sendDailyCustomSchedules() {
		try {
			int currentBit = codeProvider.getCurrentDayBit();
			Map<Integer, List<CustomScheduleRequest>> groupedSchedules = customScheduleService.getGroupedSchedules(currentBit);
			groupedSchedules.forEach((deviceId, schedules) -> {
				socketService.sendDailyCustomSchedules(deviceId, schedules);
        	});
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
		}
	}
}
