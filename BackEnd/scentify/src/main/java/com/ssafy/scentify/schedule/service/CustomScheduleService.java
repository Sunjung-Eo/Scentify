package com.ssafy.scentify.schedule.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.home.model.dto.HomeDto.CustomScheduleHomeDto;
import com.ssafy.scentify.schedule.model.dto.CustomScheduleDto;
import com.ssafy.scentify.schedule.model.dto.DeleteScheduleDto;
import com.ssafy.scentify.schedule.model.repository.CustomScheduleRepository;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest;

@Service
public class CustomScheduleService {
	
	private final CustomScheduleRepository customScheduleRepository;
	
	public CustomScheduleService(CustomScheduleRepository customScheduleRepository) {
		this.customScheduleRepository = customScheduleRepository;
	}
	
	public List<CustomScheduleHomeDto> getSchedulesByDeviceId(int mainDeviceId) {
		return customScheduleRepository.getSchedulesByDeviceId(mainDeviceId);
	}
	
	public int getDayById(int customScheduleId, int deviceId) {
		return customScheduleRepository.getDayById(customScheduleId, deviceId);
	}
	
	public DeleteScheduleDto getDayAndTime(int customScheduleId, int deviceId) {
		return customScheduleRepository.getDayAndTime(customScheduleId, deviceId);
	}
	
	public boolean createCustomSchedule(CustomScheduleDto customScheduleDto, int combinationId, String combinationName) {
		return customScheduleRepository.createCustomSchedule(customScheduleDto, combinationId, combinationName);
	}
	
	public boolean updateCustomSchedule(CustomScheduleDto customScheduleDto, int combinationId, String combinationName) {
		return customScheduleRepository.updateCustomSchedule(customScheduleDto, combinationId, combinationName);
	}

	public boolean deleteCustomScheduleById(int customScheduleId, int deviceId) {
		return customScheduleRepository.deleteCustomScheduleById(customScheduleId, deviceId);
	}
	

	public boolean deleteCustomSchedules(int deviceId) {
		return customScheduleRepository.deleteCustomSchedules(deviceId);
	}

	public Map<Integer, List<CustomScheduleRequest>> getGroupedSchedules(int currentBit) {
		List<CustomScheduleRequest> allSchedules = customScheduleRepository.selectAllySchedules(currentBit);
        return allSchedules.stream()
        					.collect(Collectors.groupingBy(CustomScheduleRequest::getDeviceId));
	}

	public List<CustomScheduleRequest> getCustomSchedules(int deviceId, int currentBit) {
		return customScheduleRepository.selectTodaySchedules(deviceId, currentBit);
	}
}
