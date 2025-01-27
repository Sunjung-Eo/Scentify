package com.ssafy.scentify.schedule.service;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.schedule.model.repository.AutoScheduleRepository;

@Service
public class AutoScheduleService {
	
	private final AutoScheduleRepository autoScheduleRepository;
	
	public AutoScheduleService(AutoScheduleRepository autoScheduleRepository) {
		this.autoScheduleRepository = autoScheduleRepository;
	}

	public boolean setMode(Integer deviceId, Integer combinationId, Integer subMode, Integer type, Integer interval) {
		return autoScheduleRepository.createMode(deviceId, combinationId, subMode, type, interval) ? true : false;
	}

	public boolean setModeWithoutInterval(Integer deviceId, Integer combinationId, Integer subMode) {
		return autoScheduleRepository.createModeWithoutInterval(deviceId, combinationId, subMode) ? true : false;
	}

}
