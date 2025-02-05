package com.ssafy.scentify.schedule.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.home.model.dto.HomeDto.AutoScheduleHomeDto;
import com.ssafy.scentify.home.model.dto.HomeDto.AutoSchedulesListResponseDto;
import com.ssafy.scentify.home.model.dto.HomeDto.CustomScheduleListResponseDto;
import com.ssafy.scentify.schedule.model.dto.AutoScheduleDto;
import com.ssafy.scentify.schedule.service.AutoScheduleService;

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
	
	private final AutoScheduleService autoScheduleService;
	private final CombinationService combinationService;
	
	public AutoScheduleController(AutoScheduleService autoScheduleService, CombinationService combinationService) {
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
			// 향 조합을 등록해줌
			CombinationDto combination = autoScheduleDto.getCombination();
			combination.setName("탈취향");
			Integer combinationId = combinationService.createCombination(combination);	
			if (combinationId  == null) { 
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 	
			}
			
			// 악취 모드 업데이트 (불가능 하다면 400 반환)
			if (!autoScheduleService.updateAutoSchedule(autoScheduleDto, combinationId)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
			}
			
			// 웹 소켓 통신으로 수정되었음을 전달 필요
			if (autoScheduleDto.isModeChange()) {
				// 웹소켓 컨트롤러 메서드 실행
			}
			
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	
}
