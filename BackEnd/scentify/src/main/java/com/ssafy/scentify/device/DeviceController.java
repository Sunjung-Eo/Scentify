package com.ssafy.scentify.device;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Arrays;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.combination.model.entity.Combination;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.model.dto.DeviceDto.CapsuleInfo;
import com.ssafy.scentify.device.model.dto.DeviceDto.RegisterDto;
import com.ssafy.scentify.device.model.dto.DeviceDto.defaultCombinationDto;
import com.ssafy.scentify.device.model.entity.Device;
import com.ssafy.scentify.group.GroupService;
import com.ssafy.scentify.group.model.dto.GroupDto.CreateDto;
import com.ssafy.scentify.group.model.entity.Group;
import com.ssafy.scentify.home.model.dto.HomeDto.DeviceHomeDto;
import com.ssafy.scentify.schedule.service.AutoScheduleService;
import com.ssafy.scentify.user.service.UserService;
import com.ssafy.scentify.websocket.HandshakeStateManager;
import com.ssafy.scentify.websocket.WebSocketController;
import com.ssafy.scentify.websocket.WebSocketService;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleInfoRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/device")
@RestController
public class DeviceController {
	
	private final UserService userService;
	private final WebSocketService socketService;
	private final DeviceService deviceService;
	private final GroupService groupService;
	private final CombinationService combinationService;
	private final AutoScheduleService autoScheduleService; 
	private final HandshakeStateManager stateManager;
	private final TokenProvider tokenProvider;
	
	public DeviceController(UserService userService, WebSocketService socketService, DeviceService deviceService, GroupService groupService, CombinationService combinationService, AutoScheduleService autoScheduleService, HandshakeStateManager stateManager, TokenProvider tokenProvider) {
		this.userService = userService;
		this.socketService = socketService;
		this.deviceService = deviceService;
		this.groupService = groupService;
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
	        
	        // device의 그룹 생성
	        String nickname = userService.getUserNickNameById(userId);
	        Integer deviceId = registerDto.getId();
	        CreateDto createDto = groupService.createGroup(deviceId, userId, nickname);
	        
	        // device의 그룹 id 업데이트
	        if (!deviceService.updateGroupId(deviceId, createDto.getId())) {
	        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        	        
//	        // 핸드셰이킹 대기 (최대 5초 동안 확인)
//	        int waitTime = 0;
//	        int maxWaitTime = 5000; // 최대 대기 시간 (5초)
//	        int sleepInterval = 500; // 0.5초마다 체크
//
//	        while (!stateManager.getHandshakeState(registerDto.getSerial())) {
//	            if (waitTime >= maxWaitTime) {
//	            	// 디바이스 삭제
//	            	deviceService.deleteDevice(deviceId, userId);
//	                return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 403 반환
//	            }
//	            Thread.sleep(sleepInterval);
//	            waitTime += sleepInterval;
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
			
			// 캡슐 정보 웹소켓에 전송
			CapsuleInfoRequest infoRequest = new CapsuleInfoRequest(capsuleInfo.getSlot1(), capsuleInfo.getSlot2(),
																	capsuleInfo.getSlot3(), capsuleInfo.getSlot4());
			socketService.sendCapsuleInfo(capsuleInfo.getId(), infoRequest);
			
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
	        CombinationDto combination = combinationDto.getCombination();
	        if (!isValidCombination(capsules, combination)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // roomType에 따라 분사량 선택
			int roomType = combinationDto.getRoomType();
			int count = getVaildCountAboutRoomType(roomType, combination);
			if (count == 0) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
	        // 기본향 및 자동화 스케줄 추가
			int deviceId = combinationDto.getId();
			Integer combinationId = addDefaultCombination(count, deviceId, roomType, combination);
			if (combinationId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			if (!addAutoMode(count, deviceId, combinationId, capsules)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
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
	private boolean isValidCombination(List<Integer> capsules, CombinationDto combination) {
	    List<Integer> choices = Arrays.asList(combination.getChoice1(), combination.getChoice2(),
										      combination.getChoice3(), combination.getChoice4());
	
	    // choice 값이 null이 아니면 capsules에 포함되어 있는지 확인
	    return choices.stream()
	                  .filter(Objects::nonNull)
	                  .allMatch(capsules::contains);
	}
	
	// 방 크기와 분사량 검사 메서드
	private int getVaildCountAboutRoomType(int roomType, CombinationDto combination) {
		int count = switch (roomType) {
			case 0 -> 3;
			case 1 -> 6;
			default -> throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
		};
		int totalCount = combination.getChoice1Count();
		if (combination.getChoice2Count() != null) { totalCount += combination.getChoice2Count(); }
		if (combination.getChoice3Count() != null) { totalCount += combination.getChoice3Count(); }
		if (combination.getChoice4Count() != null) { totalCount += combination.getChoice4Count(); }
		
		// 요청한 분사량과  roomType에 맞는 분사량 비교
		if (count != totalCount) { return 0; }
		
		return count;
	}
	
	// 기본향 등록
	private Integer addDefaultCombination(int count, int deviceId, int roomType, CombinationDto combination) {
		// 조합을 먼저 등록
        combination.setName("기본향");
		Integer combinationId = combinationService.createCombination(combination);			
		
		// 조합 id가 null이면 등록 실패로 400 반환
		if (combinationId == null) { return null; }			
		
		// 기기에 기본향 정보 등록 (등록 실패 시 400 반환)
		if(!deviceService.updateDefalutCombination(deviceId, roomType, combinationId)) {
			return null;
		}
		
		return combinationId;
	}
	
	// 자동화 모드 등록
	private boolean addAutoMode(int count, int deviceId, int combinationId, List<Integer> capsules) {
		// 자동화 모드 설정 (탈취 모드/ 단순 탐지 모드)
		if (!autoScheduleService.setMode(deviceId, combinationId, 2, null, 15) || !autoScheduleService.setMode(deviceId, combinationId, 0, null, 15)) {
			return false;
		}

		// 자동화 모드 설정 (시용자 행동 기반)
		Integer exerciseCombinationId = combinationService.createAutoCombination("운동향", capsules.get(0), count);
		if (exerciseCombinationId == null) { return false; }
		
		if (!autoScheduleService.setMode(deviceId, exerciseCombinationId, 1, 1, 15)) { return false; }
		
		Integer restCombinationId = combinationService.createAutoCombination("휴식향", capsules.get(1), count);
		if (restCombinationId == null) { return false; }
		
		if(!autoScheduleService.setMode(deviceId, restCombinationId, 1, 2, 15)) { return false; }
		
		return true;
	}
	
	// API 83번 : 캡슐 변경에 따른 기본향 재등록
	@PostMapping("/set/change")
	public ResponseEntity<?> changeDefaultCombination(@RequestBody defaultCombinationDto combinationDto, HttpServletRequest request) {
		try {
			HttpSession session = request.getSession(false);
			
			// session이 null이면 유효성 검사를 할 수 없음
	        if (session == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			List<Integer> capsules = (List<Integer>) session.getAttribute("capsules");

	        // capsules이 null이거나 비어있으면 유효성 검사를 할 수 없음
	        if (capsules == null || capsules.isEmpty()) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // choice 값 검증
	        CombinationDto combination = combinationDto.getCombination();
	        if (!isValidCombination(capsules, combination)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // roomType에 따라 분사량 선택
			int roomType = combinationDto.getRoomType();
			int count = getVaildCountAboutRoomType(roomType, combination);
			if (count == 0) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			// 등록된 디바이스 정보를 받아옴
	        Integer deviceId = combinationDto.getId();
	        DeviceHomeDto deviceInfo = deviceService.getDeviceHomeInfoById(deviceId);
	        
	        // 기존 캡슐 정보를 리스트로 만듦
	        List<Integer> beforeCapsules = new ArrayList<>();
	        beforeCapsules.add(deviceInfo.getSlot1());    beforeCapsules.add(deviceInfo.getSlot2());
	        beforeCapsules.add(deviceInfo.getSlot3());    beforeCapsules.add(deviceInfo.getSlot4());
	        
	        // 만약 기존에 설정한 방 정보와 캡슐 정보가 같다면 그냥 기본향만 수정해줌
	        if (deviceInfo.getRoomType() == combinationDto.getRoomType()) {
	        	boolean isEqual = new HashSet<>(capsules).equals(new HashSet<>(beforeCapsules));
	        	if (isEqual) {
	        		// 조합을 먼저 등록
	        		Integer combinationId = addDefaultCombination(count, deviceId, roomType, combination);
	    			if (combinationId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	    			
	    			// 로직 수행 후 세션 만료
	    			session.invalidate();
	    			return new ResponseEntity<>(HttpStatus.OK);
	        	}	        	
	        }
			
	        // 기존 자동화 스케줄 삭제
	        if (!autoScheduleService.deleteAutoSchedules(deviceId)) {
	        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        
	        // 기본향 및 자동화 스케줄 추가
			Integer combinationId = addDefaultCombination(count, deviceId, roomType, combination);
			if (combinationId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			if (!addAutoMode(count, deviceId, combinationId, capsules)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			// 로직 수행 후 세션 만료
			session.invalidate();
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 75번 : 기본 향 수정
	@PostMapping("/set/update")
	public ResponseEntity<?> updateDefultCombination(@RequestBody defaultCombinationDto combinationDto) {
		try {
			// combaintion 추출
			CombinationDto combination = combinationDto.getCombination();
			// 전달 데이터 검사
			if (combination == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// 디바이스 id와 room type 추출
			Integer deviceId = combinationDto.getId();
			Integer roomType = combinationDto.getRoomType();
			// 전달 데이터 검사
			if (deviceId == null || roomType == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// roomType에 따라 분사량 선택
			int count = switch (roomType) {
				case 0 -> 3;
				case 1 -> 6;
				default -> throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
			};
			int totalCount = combination.getChoice1Count();
			if (combination.getChoice2Count() != null) { totalCount += combination.getChoice2Count(); }
			if (combination.getChoice3Count() != null) { totalCount += combination.getChoice3Count(); }
			if (combination.getChoice4Count() != null) { totalCount += combination.getChoice4Count(); }
			
			// 요청한 분사량과  roomType에 맞는 분사량 비교
			if (count != totalCount) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
			
			// 조합 업데이트 (실패 시 400 반환)
			if (!combinationService.updateCombination(combination)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// 방 정보 업데이트 (실패 시 400 반환)
			if (!deviceService.updateRoomType(deviceId, roomType)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 70번 : 기기 정보 반환
	@PostMapping("/info")
	public ResponseEntity<?> getDeviceInfo(@RequestBody Map<String, List<Integer>> payload) {
		try {
			// deviceIds 리스트 추출
			List<Integer> deviceIds = payload.get("deviceIds");
			
			if (deviceIds == null || deviceIds.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
			
			// DB 조회
			List<DeviceHomeDto> devices = deviceService.findDevicesByIds(deviceIds);

	        // 조회 결과가 없을 경우
	        if (devices.isEmpty()) {
	            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	        }

	        // 반환할 데이터 생성
	        Map<String, List<DeviceHomeDto>> response = new HashMap<>();
	        response.put("devices", devices);
			
	        return ResponseEntity.ok(response);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 29번 : 커스텀 or 자동화 모드 설정
	@PostMapping("/mode/set")
	public  ResponseEntity<?> setDeviceMode(@RequestBody Map<String, Object> payload) {
		try {
			// 디바이스 아이디와 모드 추출
			Integer deviceId = (Integer) payload.get("deviceId");
	        boolean mode = (boolean) payload.get("mode"); 
	        
	        // 디바이스 아이디 유효성 검사
	        if (deviceId == null) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // 만약 업데이트를 실패하면 400 반환
	        if (!deviceService.updateMode(deviceId, mode)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // RB에 전달
	        socketService.sendDeviceModeUpdate(payload);
	        
	        return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	// API 54번 : 바로 분사
	@PostMapping("/spray")
	public ResponseEntity<?> sprayNow(@RequestBody Map<String, Integer> deviceIdMap) {
		try {
			// 디바이스 아이디 추출 (null일 경우 400 반환)
			Integer deviceId = deviceIdMap.get("deviceId");
			if (deviceId == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// 기본향 id 조회 
			int defaultCombinationId = deviceService.getDefaultCombinationId(deviceId);
			
			// 기본향 조합 조회 (null일 경우 400 반환)
			CombinationDto combination = combinationService.getCombinationById(defaultCombinationId);
			if (combination == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST); 
			}
			
			// 웹소켓 통신으로 combination을 보내야함
			socketService.sendRemoteOperation(deviceId, combination);
			
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 66번 : 기기 삭제
	@PostMapping("/delete")
	public ResponseEntity<?> deleteDevice(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, Integer> deviceIdMap) {
		try {
			// "Bearer " 제거
			if (!authorizationHeader.startsWith("Bearer ")) {
			    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
			String token = authorizationHeader.substring(7);
			
			// 토큰에서 id 추출
			String userId = tokenProvider.getId(token);

			// 삭제 요청한 디바이스 아이디 추출
			Integer deviceId = deviceIdMap.get("id");
			if (deviceId == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			// 디바이스 id에 해당하는 그룹 정보 조회
			Group group = groupService.getGroup(deviceId);

			// 디바이스 삭제 권한 없음
			if (!userId.equals(group.getAdminId())) {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
			
			// 핸드쉐이킹 해제를 위해 시리얼은 미리 받아 옴
			String serial = deviceService.selectSerialByDeviceId(deviceId);
			
			// 디바이스 삭제 (실패 시 404 반환)
			if (!deviceService.deleteDevice(deviceId, userId)) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
			
			//핸드쉐이킹 해제
			socketService.closeConnection(deviceId, serial);
			
			// 그룹 모두의 메인 디바이스 업데이트
			autoUpdateMainDevice(group);
			
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	public void autoUpdateMainDevice(Group group) {
		List<String> memberList = new ArrayList<>();
		memberList.add(group.getAdminId());
		if (group.getMember1Id() != null) { memberList.add(group.getMember1Id()); }
		if (group.getMember2Id() != null) { memberList.add(group.getMember2Id()); }
		if (group.getMember3Id() != null) { memberList.add(group.getMember3Id()); }
		if (group.getMember4Id() != null) { memberList.add(group.getMember4Id()); }
		
		for (String userId : memberList) {
			// 유저의 메인 디바이스 id 조회
			Integer mainDeviceId = userService.getMainDeviceById(userId);
			
			// 해당 유저의 메인 디바이스 id가 null인 경우 업데이트
			if (mainDeviceId == null) {
				List<Integer> deviceIds = groupService.getDeviceIdByUserId(userId);
				if (deviceIds.size() > 0) {
					userService.updateMainDeviceId(userId, deviceIds.get(0));
				} 
			}
		}
	}
}
