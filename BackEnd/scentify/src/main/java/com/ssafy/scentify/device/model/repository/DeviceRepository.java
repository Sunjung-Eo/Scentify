package com.ssafy.scentify.device.model.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface DeviceRepository {
	// serial 존재 여부 확인
    @Select("SELECT COUNT(*) > 0 FROM device WHERE serial = #{serial}")
    boolean existsBySerial(String serial);
}
