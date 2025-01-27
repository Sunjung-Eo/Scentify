package com.ssafy.scentify.device;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.entity.Combination;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.model.dto.DeviceDto.CapsuleInfo;
import com.ssafy.scentify.device.model.dto.DeviceDto.RegisterDto;
import com.ssafy.scentify.device.model.dto.DeviceDto.defaultCombinationDto;
import com.ssafy.scentify.schedule.service.AutoScheduleService;
import com.ssafy.scentify.websocket.HandshakeStateManager;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/device")
@RestController
public class DeviceController {
	
	private final DeviceService deviceService;
	private final CombinationService combinationService;
	private final AutoScheduleService autoScheduleService; 
	private final HandshakeStateManager stateManager;
	private final TokenProvider tokenProvider;
	
	public DeviceController(DeviceService deviceService, CombinationService combinationService, AutoScheduleService autoScheduleService, HandshakeStateManager stateManager, TokenProvider tokenProvider) {
		this.deviceService = deviceService;
		this.combinationService = combinationService;
		this.autoScheduleService = autoScheduleService;
		this.stateManager = stateManager;
		this.tokenProvider = tokenProvider;
	}
	
	// API 13번 : 기기 등록
	@PostMapping("/add")
	public ResponseEntity<?> registerDevice(@RequestHeader("Authorization") String authorizationHeader, @RequestBody RegisterDto registerDto) {
		try {
			// 이미 등록된 기기인 경우
	        if (deviceService.selectDeviceBySerial(registerDto.getSerial())) {
	            return new ResponseEntity<>(HttpStatus.CONFLICT);
	        }
			
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        // 토큰에서 userId 추출
	        String userId = tokenProvider.getId(token);
	        
	        // id 및 userId 셋팅
	        registerDto.setId();
	        registerDto.setAdminId(userId);
	        
	        // device 등록
	        deviceService.createDevice(registerDto);
	        
//	        // 핸드쉐이크 확인 전 3초 대기
//	        try {
//	            Thread.sleep(3000); // 3000 milliseconds = 3 seconds
//	        } catch (InterruptedException e) {
//	            Thread.currentThread().interrupt();
//	            log.error("3초 sleep 과정에서 에러 발생", e);
//	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//	        }
//	        
//	        // Redis에서 핸드쉐이크 성공 여부 확인
//	        if (!stateManager.getHandshakeState(registerDto.getSerial())) {
//	            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 핸드쉐이크 실패 시 반환
//	        }
	        
	        // 성공적으로 처리된 후 ID 반환
	        Map<String, Object> response = new HashMap<>();
	        response.put("id", registerDto.getId()); // 생성된 ID를 응답에 포함

	        return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 16번 : 캡슐 등록
	@PostMapping("/capsules")
	public ResponseEntity<?> inputCapsuleInfo(@RequestBody CapsuleInfo capsuleInfo, HttpServletRequest request) {
		try {
			// 캡슐 정보 업데이트
			if (!deviceService.updateCapsuleInfo(capsuleInfo)) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			
			// 세션에 캡슐 정보 저장
			HttpSession session =  request.getSession();
			List<Integer> capsules = new ArrayList<>();
			capsules.add(capsuleInfo.getSlot1());
			capsules.add(capsuleInfo.getSlot2());
			capsules.add(capsuleInfo.getSlot3());
			capsules.add(capsuleInfo.getSlot4());
			session.setAttribute("capsules", capsules);
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 19번 : 기본향 등록
	@PostMapping("/set")
	public ResponseEntity<?> inputDefualtCombination(@RequestBody defaultCombinationDto combinationDto, HttpServletRequest request) {
		try {
			HttpSession session = request.getSession(false);
			
			// session이 null이면 유효성 검사를 할 수 없음
	        if (session == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			List<Integer> capsules = (List<Integer>) session.getAttribute("capsules");

	        // capsules이 null이거나 비어있으면 유효성 검사를 할 수 없음
	        if (capsules == null || capsules.isEmpty()) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // choice 값 검증
	        if (!isValidCombination(capsules, combinationDto)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // 조합을 먼저 등록
	        defaultCombinationDto.Combination combination = combinationDto.getCombination();
			Integer combinationId = combinationService.createCombination(combination);			
			
			// 조합 id가 null이면 등록 실패로 400 반환
			if (combinationId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }			
			Integer deviceId = combinationDto.getId();
			
			// 기기 기본향 등록 (등록 실패 시 400 반환)
			if(!deviceService.updateDefalutCombination(deviceId, combinationDto.getRoomType(), combinationId)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// 자동화 모드 설정 (탈취 모드/ 단순 탐지 모드)
			if (!autoScheduleService.setMode(deviceId, combinationId, 2, null, 15) || !autoScheduleService.setModeWithoutInterval(deviceId, combinationId, 0)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// roomType에 따라 분사량 선택
			Integer roomType = combinationDto.getRoomType();
			int count = switch (roomType) {
				case 0 -> 3;
				case 1 -> 6;
				default -> throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
			};
			
			// 자동화 모드 설정 (시용자 행동 기반)
			Integer exerciseCombinationId = combinationService.createAutoCombination(capsules.get(0), count);
			if (exerciseCombinationId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			if (!autoScheduleService.setMode(deviceId, exerciseCombinationId, 1, 1, 15)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			Integer restCombinationId = combinationService.createAutoCombination(capsules.get(1), count);
			if (restCombinationId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			if(!autoScheduleService.setMode(deviceId, restCombinationId, 1, 2, 15)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			// 로직 수행 후 세션 만료
			session.invalidate();
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// 기본향 조합 유효성 검사 메서드
	private boolean isValidCombination(List<Integer> capsules, defaultCombinationDto combinationDto) {
	    List<Integer> choices = List.of(
	        combinationDto.getCombination().getChoice1(),
	        combinationDto.getCombination().getChoice2(),
	        combinationDto.getCombination().getChoice3(),
	        combinationDto.getCombination().getChoice4()
	    );

	    // choice 값이 null이 아니면 capsules에 포함되어 있는지 확인
	    return choices.stream()
	                  .filter(Objects::nonNull)
	                  .allMatch(capsules::contains);
	}
}
