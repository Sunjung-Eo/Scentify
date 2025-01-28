package com.ssafy.scentify.group;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.scentify.common.util.CodeProvider;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.DeviceService;
import com.ssafy.scentify.device.model.dto.DeviceDto.DeviceGroupInfoDto;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/group")
@RestController
public class GroupController {
	
	private final DeviceService deviceService;
	private final TokenProvider tokenProvider;
	private final CodeProvider codeProvider;
	
	@Autowired
	private RedisTemplate<String, String> redisTemplate;
	
	public GroupController(DeviceService deviceService, TokenProvider tokenProvider, CodeProvider codeProvider) {
		this.deviceService = deviceService;
		this.tokenProvider = tokenProvider;
		this.codeProvider = codeProvider;
	}
	
	// API 23번 : 그룹 초대
	@PostMapping("/invite")
	public ResponseEntity<?> inviteToGroup(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, Integer> deviceIdMap) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        // 토큰에서 userId 추출
	        String userId = tokenProvider.getId(token);
	        
	        // 디바이스 아이디 추출
	        Integer deviceId = deviceIdMap.get("id");
	        DeviceGroupInfoDto groupInfoDto = deviceService.selectGroupInfoByDeviceId(deviceId);
	        
	        // 요청 아이디가 어드민 아이디와 다름
	        if (!groupInfoDto.getAdminId().equals(userId)) { return new ResponseEntity<>(HttpStatus.FORBIDDEN); }
	        
	        // 초대 코드 생성
	        String inviteCode = codeProvider.generateVerificationCode();
	        Integer groupId = groupInfoDto.getGroupId(); // 그룹 ID 가져오기

	        // Redis에 초대 코드와 groupId를 JSON으로 저장 (유효 기간: 30분)
	        String redisKey = "invite:" + inviteCode;
	        Map<String, String> redisData = new HashMap<>();
	        redisData.put("deviceId", deviceId.toString());
	        redisData.put("groupId", groupId.toString());

	        redisTemplate.opsForValue().set(redisKey, new ObjectMapper().writeValueAsString(redisData), 30, TimeUnit.MINUTES);

	        
	        // 초대 코드와 링크 반환
	        Map<String, String> response = new HashMap<>();
	        response.put("inviteCode", inviteCode);
	        response.put("inviteLink", "https://localhost5173/invite/" + inviteCode); // 추후 프론트 실제 페이지 주소로 수정 필요
	        
	        return new ResponseEntity<>(response, HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
}
