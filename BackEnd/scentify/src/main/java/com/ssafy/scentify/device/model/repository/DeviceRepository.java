package com.ssafy.scentify.device.model.repository;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.ssafy.scentify.device.model.dto.DeviceDto.CapsuleInfo;
import com.ssafy.scentify.device.model.dto.DeviceDto.DeviceGroupInfoDto;
import com.ssafy.scentify.device.model.dto.DeviceDto.RegisterDto;
import com.ssafy.scentify.home.model.dto.HomeDto.DeviceHomeDto;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleInfoRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CapsuleRemainingRequest;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.TempHumRequest;

@Mapper
public interface DeviceRepository {
	// 기기 등록
    @Insert("INSERT INTO device (id, serial, admin_id, ip_address)"
    		+ "VALUES (#{id}, #{serial}, #{adminId}, #{ipAddress})")
	boolean createDevice(RegisterDto registerDto);
	
	// serial 존재 여부 확인
    @Select("SELECT COUNT(*) > 0 FROM device WHERE serial = #{serial}")
    boolean existsBySerial(String serial);
    
    // id 조회 쿼리
    @Select("SELECT id FROM device WHERE serial = #{serial}")
    int selectDeviceIdBySerial(String serial);
    
    // serial 조회 쿼리
    @Select("SELECT serial FROM device WHERE id = #{id}")
	String selectSerialByDeviceId(int id);
    
    // 그룹 정보 조회 쿼리
    @Select("SELECT group_id, admin_id FROM device WHERE id = #{id}")
    DeviceGroupInfoDto selectGroupInfoByDeviceId(int id);
    
    // 기본향 id 조회 쿼리
    @Select("SELECT default_combination FROM device WHERE id = #{id}")
	int getDefaultCombinationId(int id);
    
    // 모드 조회 쿼리
    @Select("SELECT mode FROM device WHERE id = #{id}")
	boolean getMode(int id);
    
    // room type 조회 쿼리
    @Select("SELECT room_type FROM device WHERE id = #{id}")
	int getRoomType(int id);
    
    // 캡슐 정보 조회 쿼리
    @Select("SELECT slot_1, slot_2, slot_3, slot_4 FROM device WHERE id = #{id}")
	CapsuleInfoRequest getCapsuleInfo(int id);
    
    // 기기 이름 조회 쿼리
    @Select("SELECT name FROM device WHERE id = #{id}")
	String getDeviceName(int id);
    
    // 디바이스 id로 정보 조회 및 반환 (별도 mapper에 쿼리 구현)
   	List<DeviceHomeDto> selectDevicesByIds(List<Integer> deviceIds);

   	// 디바이스 id로 홈탭 정보 조회 및 반환 (별도 mapper에 쿼리 구현)
	DeviceHomeDto getDeviceHomeInfoById(int deviceId);
   	
    // 그룹 아이디 업데이트
    @Update("UPDATE device SET group_id = #{groupId} WHERE id = #{id}")
    boolean updateGroupId(int id, int groupId);
    
    // 캡슐 정보 업데이트
    @Update("UPDATE device SET name = #{name}, slot_1 = #{slot1}, slot_2 = #{slot2},"
    						+" slot_3 = #{slot3}, slot_4 = #{slot4} WHERE id = #{id}")
	boolean updateCapsueInfo(CapsuleInfo capsuleInfo);
    
    // 기본향 정보 업데이트
    @Update("UPDATE device SET room_type = #{roomType}, default_combination = #{combinationId} WHERE id = #{id}")
	boolean updateDefalutCombination(int id, int roomType, int combinationId);
	
	// 온습도 정보 업데이트
	@Update("UPDATE device SET temperature = #{request.temperature}, humidity = #{request.humidity} WHERE id = #{id}")
	boolean updateTempHum(int id, @Param("request") WebSocketDto.TempHumRequest request);
	
	// 캡슐 잔여량 정보 업데이트
	@Update("UPDATE device SET slot_1_remainingRatio = #{request.slot1RemainingRatio}, slot_2_remainingRatio = #{request.slot2RemainingRatio},"
			+ "slot_3_remainingRatio = #{request.slot3RemainingRatio}, slot_4_remainingRatio = #{request.slot4RemainingRatio} WHERE id = #{id}")
	boolean updateCapsuleRemaining(int id, @Param("request") WebSocketDto.CapsuleRemainingRequest request);
	
	// 모드 업데이트
    @Update("UPDATE device SET mode = #{mode} WHERE id = #{id}")
	boolean updateMode(int id, boolean mode);
    
    // room type 업데이트
    @Update("UPDATE device SET room_type = #{roomType} WHERE id = #{id}")
	boolean updateRoomType(int id, int roomType);
    
    // id에 해당하는 기기 삭제
    @Delete("DELETE FROM device WHERE id = #{id} AND admin_id = #{userId}")
	boolean deleteDevice(int id, String userId);
}
