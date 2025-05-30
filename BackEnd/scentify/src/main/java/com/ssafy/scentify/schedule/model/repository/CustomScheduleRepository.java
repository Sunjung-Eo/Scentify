package com.ssafy.scentify.schedule.model.repository;

import java.util.List;

import org.apache.ibatis.annotations.*;
import com.ssafy.scentify.home.model.dto.HomeDto.CustomScheduleHomeDto;
import com.ssafy.scentify.schedule.model.dto.CustomScheduleDto;
import com.ssafy.scentify.schedule.model.dto.DeleteScheduleDto;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest;

@Mapper
public interface CustomScheduleRepository {
	
	// 디바이스 아이디로 스케줄 조회
	@Select("SELECT id, name, combination_id, combination_name, day, start_time, end_time, `interval`, mode_on "
	          + "FROM customschedule WHERE device_id = #{deviceId}")
    @Results({
        @Result(column = "id", property = "id"),
        @Result(column = "name", property = "name"),
        @Result(column = "combination_id", property = "combinationId"),
        @Result(column = "combination_name", property = "combinationName"),
        @Result(column = "day", property = "day"),
        @Result(column = "start_time", property = "startTime"),
        @Result(column = "end_time", property = "endTime"),
        @Result(column = "interval", property = "interval"),
        @Result(column = "mode_on", property = "modeOn")
    })
    List<CustomScheduleHomeDto> getSchedulesByDeviceId(int deviceId);
	
	// 배치를 위해 모든 custom 스케줄 조회 (별도의 매퍼에 구현)
	List<CustomScheduleRequest> selectAllySchedules(int currentBit);
	
	// 당일에 해당하는 스케줄 정보를 조회 (별도의 매퍼에 구현)
	List<CustomScheduleRequest> selectTodaySchedules(int deviceId, int currentBit);
	
	// 요일 정보를 조회
	@Select("SELECT day FROM customschedule WHERE id = #{id} AND device_id = #{deviceId}")
	int getDayById(int id, int deviceId);
	
	// 요일 정보와 시작, 종료 시간을 조회
	@Select("SELECT day, start_time, end_time FROM customschedule WHERE id = #{id} AND device_id = #{deviceId}")
	DeleteScheduleDto getDayAndTime(int id, int deviceId);
	
	// 커스텀 스케줄 생성
	@Insert("INSERT INTO customschedule (name, device_id, combination_id, combination_name, day, start_time, end_time, `interval`, mode_on, created_at, updated_at)" 
		    + " VALUES (#{customSchedule.name}, #{customSchedule.deviceId}, #{combinationId}, #{conbinationName}, #{customSchedule.day},"
			+ " #{customSchedule.startTime}, #{customSchedule.endTime}, #{customSchedule.interval}, #{customSchedule.modeOn}, NOW(), NOW())")
	@Options(useGeneratedKeys = true, keyProperty = "customSchedule.id", keyColumn = "id")
	boolean createCustomSchedule(@Param("customSchedule") CustomScheduleDto customScheduleDto, int combinationId, String conbinationName);
	
	// 커스텀 스케줄 수정
	@Update("UPDATE customschedule SET name = #{customSchedule.name}, combination_id = #{combinationId}, combination_name = CASE WHEN #{combinationName} IS NOT NULL "
			+ "THEN #{combinationName} ELSE combination_name END, day = #{customSchedule.day}, start_time = #{customSchedule.startTime}, end_time = #{customSchedule.endTime}, "
			+ "`interval` = #{customSchedule.interval}, mode_on = #{customSchedule.modeOn}, updated_at = NOW() WHERE id = #{customSchedule.id} AND device_id = #{customSchedule.deviceId}")
	boolean updateCustomSchedule(@Param("customSchedule") CustomScheduleDto customScheduleDto, int combinationId, String combinationName);
	
	// 커스텀 스케줄 삭제
	@Delete("DELETE FROM customschedule WHERE id = #{id} AND device_id = #{deviceId}")
	boolean deleteCustomScheduleById(int id, int deviceId);
	
	// 기기의 모든 커스텀 스케줄 삭제
	@Delete("DELETE FROM customschedule WHERE device_id = #{deviceId}")
	int deleteCustomSchedules(int deviceId);
}
