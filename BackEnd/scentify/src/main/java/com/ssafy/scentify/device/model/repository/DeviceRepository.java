package com.ssafy.scentify.device.model.repository;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.ssafy.scentify.device.model.dto.DeviceDto.CapsuleInfo;
import com.ssafy.scentify.device.model.dto.DeviceDto.DeviceInfoDto;
import com.ssafy.scentify.device.model.dto.DeviceDto.RegisterDto;

@Mapper
public interface DeviceRepository {
	// serial 존재 여부 확인
    @Select("SELECT COUNT(*) > 0 FROM device WHERE serial = #{serial}")
    boolean existsBySerial(String serial);
    
    // 기기 등록
    @Insert("INSERT INTO device (id, serial, admin_id, ip_address)"
    		+ "VALUES (#{id}, #{serial}, #{adminId}, #{ipAddress})")
	boolean createDevice(RegisterDto registerDto);
    
    // 캡슐 정보 업데이트
    @Update("UPDATE device SET name = #{name}, slot_1 = #{slot1}, slot_2 = #{slot2},"
    						+" slot_3 = #{slot3}, slot_4 = #{slot4} WHERE id = #{id}")
	boolean updateCapsueInfo(CapsuleInfo capsuleInfo);
    
    // 기본향 정보 업데이트
    @Update("UPDATE device SET room_type = #{roomType}, default_combination = #{combinationId} WHERE id = #{id}")
	boolean updateDefalutCombination(Integer id, Integer roomType, Integer combinationId);
    
    // 디바이스 id로 정보 조회 및 반환
	List<DeviceInfoDto> selectDevicesByIds(List<Integer> deviceIds);
}
