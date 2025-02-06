package com.ssafy.scentify.schedule.model.repository;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.ssafy.scentify.home.model.dto.HomeDto.AutoScheduleHomeDto;
import com.ssafy.scentify.schedule.model.dto.AutoScheduleDto;
import com.ssafy.scentify.schedule.model.dto.UpdateModeDto.Schedule;

@Mapper
public interface AutoScheduleRepository {
	
	// 인터벌이 있는 자동화 모드 생성
	@Insert("Insert INTO autoschedule (device_id, combination_id, sub_mode, type, `interval`, mode_on, created_at, updated_at) "
			+ "VALUES (#{deviceId}, #{combinationId}, #{subMode}, #{type}, #{interval}, 0, NOW(), NOW())")
	boolean createMode(int deviceId, int combinationId, int subMode, Integer type, int interval);
	
	// 인터벌이 없는 자동화 모드 생성
	@Insert("Insert INTO autoschedule (device_id, combination_id, sub_mode, mode_on, created_at, updated_at) "
			+ "VALUES (#{deviceId}, #{combinationId}, #{subMode}, 0, NOW(), NOW())")
	boolean createModeWithoutInterval(int deviceId, int combinationId, int subMode);
	
	// 디바이스 아이디에 해당하는 자동화 스케줄 선택
	@Select("SELECT id, combination_id, sub_mode, type, `interval`, mode_on " +
	        "FROM autoschedule WHERE device_id = #{deviceId}")
	@Results({
	    @Result(column = "id", property = "id"),
	    @Result(column = "combination_id", property = "combinationId"),
	    @Result(column = "sub_mode", property = "subMode"),
	    @Result(column = "type", property = "type"),
	    @Result(column = "interval", property = "interval"),
	    @Result(column = "mode_on", property = "modeOn")
	})
	List<AutoScheduleHomeDto> selectSchedulesByDeviceId(int deviceId);
	
	// 자동화 스케줄 수정
<<<<<<< Updated upstream
	@Update("UPDATE autoschedule SET combination_id = #{combinationId}, `interval` = CASE WHEN #{autoSchedule.interval} IS NOT NULL THEN #{autoSchedule.interval} ELSE `interval` END, "
			+ "mode_on = #{autoSchedule.modeOn}, updated_at = NOW() WHERE id = #{autoSchedule.id} AND device_id = #{autoSchedule.deviceId}")
	boolean updateAutoSchedule(@Param("autoSchedule") AutoScheduleDto autoScheduleDto, int combinationId);
	
	// 자동화 스케줄 중 사용자 행동 관련 스케줄 수정
	@Update("UPDATE autoschedule SET `interval` = #{autoSchedule.interval}, mode_on = #{autoSchedule.modeOn}, updated_at = NOW() "
			+ "WHERE id = #{autoSchedule.id} AND device_id = #{autoSchedule.deviceId}")
	boolean updateActionSchedule(@Param("autoSchedule") Schedule schedule);
=======
	@Update("UPDATE autoschedule SET combination_id = #{combinationId}, `interval` = #{autoSchedule.interval}, mode_on = #{autoSchedule.modeOn}, "
			+ "updated_at = NOW() WHERE id = #{autoSchedule.id} AND device_id = #{autoSchedule.deviceId}")
	boolean updateAutoSchedule(@Param("autoSchedule") AutoScheduleDto autoScheduleDto, Integer combinationId);
	
	// 자동화 스케줄 중 운동과 휴식 모드 수정
	@Update("UPDATE autoschedule SET `interval` = #{autoSchedule.interval}, mode_on = #{autoSchedule.modeOn}, "
			+ "updated_at = NOW() WHERE id = #{autoSchedule.id} AND device_id = #{autoSchedule.deviceId}")
	boolean updateScheduleMode(@Param("autoSchedule") Schedule scehdule);
>>>>>>> Stashed changes
}
