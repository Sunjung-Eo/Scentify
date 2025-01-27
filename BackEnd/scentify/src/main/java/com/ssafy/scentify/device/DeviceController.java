package com.ssafy.scentify.device;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.model.dto.DeviceDto.CapsuleInfo;
import com.ssafy.scentify.device.model.dto.DeviceDto.RegisterDto;
import com.ssafy.scentify.websocket.HandshakeStateManager;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/device")
@RestController
public class DeviceController {
	
	private final DeviceService deviceService;
	private final HandshakeStateManager stateManager;
	private final TokenProvider tokenProvider;
	
	public DeviceController(DeviceService deviceService, HandshakeStateManager stateManager, TokenProvider tokenProvider) {
		this.deviceService = deviceService;
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
	
	@PostMapping("/capsules")
	public ResponseEntity<?> inputCapsuleInfo(@RequestBody CapsuleInfo capsuleInfo) {
		try {
			// 캡슐 정보 업데이트
			if (!deviceService.updateCapsuleInfo(capsuleInfo)) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
