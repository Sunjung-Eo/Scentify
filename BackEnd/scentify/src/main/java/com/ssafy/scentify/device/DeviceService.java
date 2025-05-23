package com.ssafy.scentify.device;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.device.model.dto.DeviceDto.CapsuleInfo;
import com.ssafy.scentify.device.model.dto.DeviceDto.DeviceGroupInfoDto;
import com.ssafy.scentify.device.model.dto.DeviceDto.RegisterDto;
import com.ssafy.scentify.device.model.repository.DeviceRepository;
import com.ssafy.scentify.home.model.dto.HomeDto.DeviceHomeDto;
import com.ssafy.scentify.user.model.repository.UserRepository;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleInfoRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleRemainingRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TempHumRequest;

@Service
public class DeviceService {
	private final UserRepository userRepository;
	private final DeviceRepository deviceRepository;
	
	public DeviceService(UserRepository userRepository, DeviceRepository deviceRepository) {
		this.userRepository = userRepository;
		this.deviceRepository = deviceRepository;
	}
	
	public boolean selectDeviceBySerial(String serial) {
		return deviceRepository.existsBySerial(serial) ? true : false;
	}
	
	public int selectDeviceIdBySerial(String serial) {
		return deviceRepository.selectDeviceIdBySerial(serial);
	}
	
	public String selectSerialByDeviceId(int deviceId) {
		return deviceRepository.selectSerialByDeviceId(deviceId);
	}
	
	public DeviceGroupInfoDto selectGroupInfoByDeviceId(Integer id) {
		return deviceRepository.selectGroupInfoByDeviceId(id);
	}
	
	public List<DeviceHomeDto> findDevicesByIds(List<Integer> deviceIds) {
		return deviceRepository.selectDevicesByIds(deviceIds);
	}

	public DeviceHomeDto getDeviceHomeInfoById(int mainDeviceId) {
		return deviceRepository.getDeviceHomeInfoById(mainDeviceId);
	}
	

	public int getDefaultCombinationId(int deviceId) {
		return deviceRepository.getDefaultCombinationId(deviceId);
	}
	
	public boolean getMode(int deviceId) {
		return deviceRepository.getMode(deviceId);
	}
	
	public int getRoomType(int deviceId) {
		return deviceRepository.getRoomType(deviceId);
	}

	public String getDeviceName(int deviceId) {
		return deviceRepository.getDeviceName(deviceId);
	}
	
	public CapsuleInfoRequest getCapsuleInfo(int deviceId) {
		return deviceRepository.getCapsuleInfo(deviceId);
	}

	public boolean createDevice(RegisterDto registerDto) {
		if (!deviceRepository.createDevice(registerDto)) return false;
		userRepository.updateMainDeviceId(registerDto.getAdminId(), registerDto.getId());
		return true;
	}

	public boolean updateCapsuleInfo(CapsuleInfo capsuleInfo) {
		return deviceRepository.updateCapsueInfo(capsuleInfo) ? true : false;
	}

	public boolean updateDefalutCombination(Integer id, Integer roomType, Integer combinationId) {
		return deviceRepository.updateDefalutCombination(id, roomType, combinationId) ? true : false;
	}

	public boolean updateTempHum(int id, TempHumRequest request) {
		return deviceRepository.updateTempHum(id, request);
	}

	public boolean updateCapsuleRemaining(int id, CapsuleRemainingRequest request) {
		return deviceRepository.updateCapsuleRemaining(id, request);	
	}

	public boolean updateGroupId(int id, int groupId) {
		return deviceRepository.updateGroupId(id, groupId);
	}

	public boolean updateMode(int id, boolean mode) {
		return deviceRepository.updateMode(id, mode);
	}
	
	public boolean updateRoomType(int id, int roomType) {
		return deviceRepository.updateRoomType(id, roomType);
	}

	public boolean deleteDevice(int id, String userId) {
		return deviceRepository.deleteDevice(id, userId);
	}
}
