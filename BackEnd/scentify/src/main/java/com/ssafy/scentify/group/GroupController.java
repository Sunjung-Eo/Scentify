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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.scentify.common.util.CodeProvider;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.DeviceService;
import com.ssafy.scentify.device.model.dto.DeviceDto.DeviceGroupInfoDto;
import com.ssafy.scentify.group.model.dto.GroupDto.DeleteMemberDto;
import com.ssafy.scentify.group.model.dto.GroupDto.MemberDto;
import com.ssafy.scentify.group.model.entity.Group;
import com.ssafy.scentify.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/group")
@RestController
public class GroupController {
	
	private final UserService userService;
	private final DeviceService deviceService;
	private final GroupService groupService;
	private final TokenProvider tokenProvider;
	private final CodeProvider codeProvider;
	
	@Autowired
	private RedisTemplate<String, String> redisTemplate;
	
	public GroupController(UserService userService, DeviceService deviceService, GroupService groupService, TokenProvider tokenProvider, CodeProvider codeProvider) {
		this.userService = userService;
		this.deviceService = deviceService;
		this.groupService = groupService;
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
	        Integer deviceId = deviceIdMap.get("deviceId");
	        DeviceGroupInfoDto groupInfoDto = deviceService.selectGroupInfoByDeviceId(deviceId);
	        
	        // 요청 아이디가 어드민 아이디와 다름
	        if (groupInfoDto == null || !groupInfoDto.getAdminId().equals(userId)) { return new ResponseEntity<>(HttpStatus.FORBIDDEN); }
	        
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
	
	// API 24번 : 그룹 링크로 가입
	@PostMapping("/verify-link")
	public ResponseEntity<?> joinGroupByLink(@RequestBody Map<String, String> inviteCodeMap, HttpServletRequest request) {
		try {
			// 초대 코드 추출 및 유효성 검사
	        String inviteCode = inviteCodeMap.get("inviteCode");
	        if (inviteCode == null || inviteCode.isBlank() || inviteCode.length() != 8) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        
	        // Redis에서 초대 코드 데이터 가져오기
	        String redisKey = "invite:" + inviteCode;
	        String redisData = redisTemplate.opsForValue().get(redisKey);

	        // Redis에 데이터가 없으면 초대 코드가 유효하지 않음
	        if (redisData == null) { return new ResponseEntity<>(HttpStatus.GONE); }

	        // Redis 데이터를 JSON으로 파싱
	        ObjectMapper objectMapper = new ObjectMapper();
	        Map<String, String> inviteData = objectMapper.readValue(redisData, new TypeReference<>() {});

	        // Redis 데이터에서 groupId와 deviceId 추출
	        Integer groupId = Integer.parseInt(inviteData.get("groupId"));
	        Integer deviceId = Integer.parseInt(inviteData.get("deviceId"));
	        
	        // 세션 부여 및 데이터 저장
	        HttpSession session = request.getSession();
	        session.setAttribute("groupId", groupId);
	        session.setAttribute("deviceId", deviceId);
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	// API 25번 : 그룹 코드로 가입
	@PostMapping("/verify-code")
	public ResponseEntity<?> joinGroupByCode(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, String> inviteCodeMap) {
	    try {
	        // "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);

	        // 토큰에서 userId 추출
	        String userId = tokenProvider.getId(token);

	        // 초대 코드 추출 및 유효성 검사
	        String inviteCode = inviteCodeMap.get("inviteCode");
	        if (inviteCode == null || inviteCode.isBlank() || inviteCode.length() != 8) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }

	        // Redis에서 초대 코드 데이터 가져오기
	        String redisKey = "invite:" + inviteCode;
	        String redisData = redisTemplate.opsForValue().get(redisKey);

	        // Redis에 데이터가 없으면 초대 코드가 유효하지 않음
	        if (redisData == null) { return new ResponseEntity<>(HttpStatus.GONE); }

	        // Redis 데이터를 JSON으로 파싱
	        ObjectMapper objectMapper = new ObjectMapper();
	        Map<String, String> inviteData = objectMapper.readValue(redisData, new TypeReference<>() {});

	        // Redis 데이터에서 groupId와 deviceId 추출
	        Integer groupId = Integer.parseInt(inviteData.get("groupId"));
	        Integer deviceId = Integer.parseInt(inviteData.get("deviceId"));

	        // 그룹에 사용자 추가 
	        String nickname = userService.getUserNiceNameById(userId);
	        MemberDto memberDto = new MemberDto(groupId, userId, nickname);
	        
	        // 그룹에 자리가 없으면 409 반환
	        if (!groupService.updateMember(memberDto)) { return new ResponseEntity<>(HttpStatus.CONFLICT); };
	        
	        // 만약 그룹 가입했을 때 해당 사용자의 main Device가 없다면 설정해줌 
	        userService.updateMainDeviceIdIfNull(userId, deviceId);

	        return new ResponseEntity<>(HttpStatus.OK);
	    } catch (Exception e) {
	        // 예기치 않은 에러 처리
	        log.error("Exception: ", e);
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}
	
	// API 68번 : 디바이스별 그룹 조회
	@PostMapping("/info")
	public ResponseEntity<?> getGroupByDeviceId(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, Integer> deviceIdMap) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        // 토큰에서 userId 추출
	        String userId = tokenProvider.getId(token);
	        
			// 디바이스 아이디 추출
	        Integer deviceId = deviceIdMap.get("deviceId");
	        DeviceGroupInfoDto groupInfoDto = deviceService.selectGroupInfoByDeviceId(deviceId);
	        
	        // 그룹 정보 DB 조회
	        Group group = groupService.selectGroupById(groupInfoDto.getGroupId());
	        if (group == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // 요청자의 ID가 그룹 멤버 ID에 포함되어 있는지 검사
	        boolean isMember = userId.equals(group.getMember1Id()) || userId.equals(group.getMember2Id()) ||
	                           userId.equals(group.getMember3Id()) || userId.equals(group.getMember4Id()) ||
	                           userId.equals(group.getAdminId());

	        if (!isMember) { return new ResponseEntity<>(HttpStatus.FORBIDDEN); }
	        
	        return ResponseEntity.ok(Map.of("group", group));
		} catch (Exception e) {
	        // 예기치 않은 에러 처리
	        log.error("Exception: ", e);
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}
	
	// API 26번 : 그룹 멤버 삭제
	@PostMapping("/member/delete")
	public ResponseEntity<?> deleteGroupMember(@RequestHeader("Authorization") String authorizationHeader, @RequestBody DeleteMemberDto deleteMemberDto) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        // 토큰에서 userId 추출
	        String userId = tokenProvider.getId(token);
	        
	        // 그룹 아이디 추출
	        Integer groupId = deleteMemberDto.getGroupId();
	        
	        // 그룹 아이디로 그룹 정보 DB 조회
 			Group group = groupService.selectGroupById(groupId);
 			
 			// 그룹 정보가 없음
 			if (group == null) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
 			
 			// 요청 아이디가 그룹 어드민이 아님
 			if (!group.getAdminId().equals(userId)) { return new ResponseEntity<>(HttpStatus.FORBIDDEN); }	        
 			
 			// 삭제 요청 ID가 그룹 멤버 ID에 포함되어 있는지 검사
 			String memberId = deleteMemberDto.getMemberId();			
 			String memberPosition = null;

	 		if (memberPosition == null && memberId.equals(group.getMember1Id())) { memberPosition = "member_1"; }
	 		if (memberPosition == null && memberId.equals(group.getMember2Id())) { memberPosition = "member_2"; }
	 		if (memberPosition == null && userId.equals(group.getMember3Id())) { memberPosition = "member_3"; }
	 		if (memberPosition == null && userId.equals(group.getMember4Id())) { memberPosition = "member_4"; }
	
	 		if (memberPosition == null) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
 			
	 		// 해당 멤버 자리를 null로 변경
	 		if (!groupService.updateGroupMemberById(groupId, memberPosition)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
		
	        return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
	        // 예기치 않은 에러 처리
	        log.error("Exception: ", e);
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}
	
	// API 27번 : 그룹 삭제
	@PostMapping("/delete")
	public ResponseEntity<?> deleteGroup(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, Integer> groupIdMap) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        // 토큰에서 userId 추출
	        String userId = tokenProvider.getId(token);
			
	        // 그룹 아이디 추출
			Integer groupId = groupIdMap.get("groupId");
			
			// 그룹 아이디로 그룹 정보 DB 조회
			Group group = groupService.selectGroupById(groupId);
			
			// 그룹 정보가 없음
			if (group == null) { return new ResponseEntity<>(HttpStatus.NOT_FOUND); }
			
			// 요청 아이디가 그룹 어드민이 아님
			if (!group.getAdminId().equals(userId)) { return new ResponseEntity<>(HttpStatus.FORBIDDEN); }
			
			// 모든 그룹 멤버를 null로 만듦 (수행 되지 않았을 경우 400 반환)
			if (!groupService.updateGroupAllMemberById(groupId)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
	        // 예기치 않은 에러 처리
	        log.error("Exception: ", e);
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}
	
	
}
