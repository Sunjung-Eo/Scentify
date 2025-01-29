package com.ssafy.scentify.schedule.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.home.model.dto.HomeDto.AutoScheduleHomeDto;
import com.ssafy.scentify.schedule.model.repository.AutoScheduleRepository;

@Service
public class AutoScheduleService {
	
	private final AutoScheduleRepository autoScheduleRepository;
	
	public AutoScheduleService(AutoScheduleRepository autoScheduleRepository) {
		this.autoScheduleRepository = autoScheduleRepository;
	}

	public boolean setMode(int deviceId, int combinationId, int subMode, Integer type, int interval) {
		return autoScheduleRepository.createMode(deviceId, combinationId, subMode, type, interval) ? true : false;
	}

	public boolean setModeWithoutInterval(int deviceId, int combinationId, int subMode) {
		return autoScheduleRepository.createModeWithoutInterval(deviceId, combinationId, subMode) ? true : false;
	}

	public List<AutoScheduleHomeDto> getSchedulesByDeviceId(Integer mainDeviceId) {
		return autoScheduleRepository.selectSchedulesByDeviceId(mainDeviceId);
	}

}
