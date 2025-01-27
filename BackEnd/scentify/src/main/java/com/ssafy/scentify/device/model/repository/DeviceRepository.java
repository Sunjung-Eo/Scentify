package com.ssafy.scentify.device.model.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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
}
