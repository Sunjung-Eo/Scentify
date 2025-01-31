package com.ssafy.scentify.schedule.model.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AutoScheduleRepository {
	
	// 악취 탐지 모드 생성
	@Insert("Insert INTO autoschedule (device_id, combination_id, sub_mode, `interval`, mode_on, created_at, updated_at) "
			+ "VALUES (#{deviceId}, #{combinationId}, #{subMode}, #{interval}, 0, NOW(), NOW())")
	boolean createDeodorizationMode(Integer deviceId, Integer combinationId, Integer subMode, Integer interval);
	
	// 단순 탐지 모드 생성
	@Insert("Insert INTO autoschedule (device_id, combination_id, sub_mode, mode_on, created_at, updated_at) "
			+ "VALUES (#{deviceId}, #{combinationId}, #{subMode}, 0, NOW(), NOW())")
	boolean createDetectionMode(Integer deviceId, Integer combinationId, Integer subMode);

}
