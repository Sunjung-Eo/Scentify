package com.ssafy.scentify.model.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.ssafy.scentify.model.entity.UserSecuInfo;

@Mapper
public interface UserSecuInfoRepository {

	// userSecuInfo 삽입
	@Insert("INSERT INTO UserSecuInfo (user_id, salt) VALUES (#{userId}, #{salt})")
	boolean createSecuInfo(UserSecuInfo secuInfo);
	
	// userId로 레코드 찾기
	@Select("SELECT * FROM UserSecuInfo WHERE user_id = #{userId}")
	UserSecuInfo getSecuInfoById(String userId);
}
