package com.ssafy.scentify.home;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.DeviceService;
import com.ssafy.scentify.favorite.FavoriteService;
import com.ssafy.scentify.group.GroupService;
import com.ssafy.scentify.home.model.dto.HomeDto.AutoScheduleHomeDto;
import com.ssafy.scentify.home.model.dto.HomeDto.CustomScheduleHomeDto;
import com.ssafy.scentify.home.model.dto.HomeDto.DeviceHomeDto;
import com.ssafy.scentify.home.model.dto.HomeDto.HomeResponseDto;
import com.ssafy.scentify.home.model.dto.HomeDto.UserHomeDto;
import com.ssafy.scentify.schedule.service.AutoScheduleService;
import com.ssafy.scentify.schedule.service.CustomScheduleService;
import com.ssafy.scentify.user.service.UserService;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@Slf4j
@RequestMapping("/v1/home")
@RestController
public class HomeController {
	
	private final UserService userService;
	private final DeviceService deviceService;
	private final GroupService groupService;
	private final FavoriteService favoriteService;
	private final AutoScheduleService autoScheduleService;
	private final CustomScheduleService customScheduleService;
	private final TokenProvider tokenProvider;
	
	public HomeController(UserService userService, DeviceService deviceService, GroupService groupService, FavoriteService favoriteService, AutoScheduleService autoScheduleService, CustomScheduleService customScheduleService, TokenProvider tokenProvider) {
		this.userService = userService;
		this.deviceService = deviceService;
		this.groupService = groupService;
		this.favoriteService = favoriteService;
		this.autoScheduleService = autoScheduleService;
		this.customScheduleService = customScheduleService;
		this.tokenProvider = tokenProvider;
	}
	
	// API 28번 : 홈탭 정보 반환
	@PostMapping("/info")
	public ResponseEntity<?> getHomeInfo(@RequestHeader("Authorization") String authorizationHeader) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
			
	        // user 서비스 정보 DB에서 가져오기
	        UserHomeDto userHomeDto = userService.getUserHomeInfoById(userId);
	        
	        // 사용자가 속해있는 그룹 아이디를 조회해옴
	        List<Integer> deviceIds = groupService.getDeviceIdByUserId(userId);
	        Map<Integer, String> deviceIdsAndNames = new HashMap<>();
	        if (deviceIds != null) {
	        	for (int deviceId : deviceIds) {
	        		String deviceName = deviceService.getDeviceName(deviceId);
	        		deviceIdsAndNames.put(deviceId, deviceName);
	        	}
	        }
	        
	        // 메인 디바이스가 설정되어 있으면 정보 가져오기
	        DeviceHomeDto deviceHomeDto = new DeviceHomeDto(); 
	        List<AutoScheduleHomeDto> autoSchedules = new ArrayList<>(); 
	        List<CustomScheduleHomeDto> customSchedules = new ArrayList<>();
	        
	        Integer mainDeviceId = userHomeDto.getMainDeviceId();
	        if (mainDeviceId != null) {
		        // 메인 기기 정보 DB에서 가져오기
		        deviceHomeDto = deviceService.getDeviceHomeInfoById(mainDeviceId);
		        autoSchedules = autoScheduleService.getSchedulesByDeviceId(mainDeviceId);
		        customSchedules = customScheduleService.getSchedulesByDeviceId(mainDeviceId);
	        }
	        
	        // 해당 user의 찜 combination id 모두 가져오기
	        List<Integer> favorites = favoriteService.getAllFavoriteIds(userId);
	        
	        // 응답 DTO 생성
	        HomeResponseDto response = new HomeResponseDto();
	        response.setUser(userHomeDto);
	        response.setDeviceIdsAndNames(deviceIdsAndNames);
	        response.setMainDevice(deviceHomeDto);
	        response.setAutoSchedules(autoSchedules);
	        response.setCustomSchedules(customSchedules);
	        response.setFavorites(favorites);

	        // JSON 응답 반환
	        return ResponseEntity.ok(response);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
}
