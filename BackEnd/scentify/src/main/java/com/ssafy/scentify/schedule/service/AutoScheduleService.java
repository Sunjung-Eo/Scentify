package com.ssafy.scentify.schedule.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.home.model.dto.HomeDto.AutoScheduleHomeDto;
import com.ssafy.scentify.schedule.model.dto.AutoScheduleDto;
import com.ssafy.scentify.schedule.model.dto.UpdateModeDto.Schedule;
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

	public List<AutoScheduleHomeDto> getSchedulesByDeviceId(int mainDeviceId) {
		return autoScheduleRepository.selectSchedulesByDeviceId(mainDeviceId);
	}

	public boolean updateAutoSchedule(AutoScheduleDto autoScheduleDto, int combinationId) {
		return autoScheduleRepository.updateAutoSchedule(autoScheduleDto, combinationId);
	}
	
	public boolean updateActionSchedule(Schedule schedule) {
		return autoScheduleRepository.updateActionSchedule(schedule);
	}
	
	public boolean deleteAutoSchedules(int deviceId) {
		return autoScheduleRepository.deleteAutoSchedules(deviceId);
	}
}
