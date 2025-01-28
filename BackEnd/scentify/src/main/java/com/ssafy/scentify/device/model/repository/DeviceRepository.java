package com.ssafy.scentify.device.model.repository;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.ssafy.scentify.device.model.dto.DeviceDto.CapsuleInfo;
import com.ssafy.scentify.device.model.dto.DeviceDto.DeviceInfoDto;
import com.ssafy.scentify.device.model.dto.DeviceDto.RegisterDto;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleRemainingRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TempHumRequest;

@Mapper
public interface DeviceRepository {
	// serial 존재 여부 확인
    @Select("SELECT COUNT(*) > 0 FROM device WHERE serial = #{serial}")
    boolean existsBySerial(String serial);
    
    // 기기 등록
    @Insert("INSERT INTO device (id, serial, admin_id, ip_address)"
    		+ "VALUES (#{id}, #{serial}, #{adminId}, #{ipAddress})")
	boolean createDevice(RegisterDto registerDto);
    
    // serial 조회 쿼리
    @Select("SELECT serial FROM device WHERE id = #{id}")
    String getSerialByDeviceId(Integer id);
    
    // 그룹 아이디 업데이트
    @Update("UPDATE device SET group_id = #{groupId} WHERE id = #{id}")
    boolean updateGroupId(Integer id, Integer groupId);
    
    // 캡슐 정보 업데이트
    @Update("UPDATE device SET name = #{name}, slot_1 = #{slot1}, slot_2 = #{slot2},"
    						+" slot_3 = #{slot3}, slot_4 = #{slot4} WHERE id = #{id}")
	boolean updateCapsueInfo(CapsuleInfo capsuleInfo);
    
    // 기본향 정보 업데이트
    @Update("UPDATE device SET room_type = #{roomType}, default_combination = #{combinationId} WHERE id = #{id}")
	boolean updateDefalutCombination(Integer id, Integer roomType, Integer combinationId);
    
    // 디바이스 id로 정보 조회 및 반환
	List<DeviceInfoDto> selectDevicesByIds(List<Integer> deviceIds);
	
	// 온습도 정보 업데이트
	@Update("UPDATE device SET temperature = #{request.temperature}, humidity = #{request.humidity} WHERE serial = #{serial}")
	boolean updateTempHum(String serial, @Param("request") WebSocketDto.TempHumRequest request);
	
	// 캡슐 잔여량 정보 업데이트
	@Update("UPDATE device SET slot_1_remainingRatio = #{request.slot1RemainingRatio}, slot_2_remainingRatio = #{request.slot2RemainingRatio},"
			+ "slot_3_remainingRatio = #{request.slot3RemainingRatio}, slot_4_remainingRatio = #{request.slot4RemainingRatio} WHERE serial = #{serial}")
	boolean updateCapsuleRemaining(String serial, @Param("request") WebSocketDto.CapsuleRemainingRequest request);
}
