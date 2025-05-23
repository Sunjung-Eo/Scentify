package com.ssafy.scentify.user.model.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.ssafy.scentify.user.model.entity.UserSecuInfo;

@Mapper
public interface UserSecuInfoRepository {

	// userSecuInfo 삽입
	@Insert("INSERT INTO usersecuinfo (user_id, salt) VALUES (#{userId}, #{salt})")
	boolean createSecuInfo(UserSecuInfo secuInfo);
	
	// userId로 레코드 찾기
	@Select("SELECT * FROM usersecuinfo WHERE user_id = #{userId}")
	UserSecuInfo getSecuInfoById(String userId);
	
	// userId에 해당하는 유저의 salt 업데이트
	@Update("UPDATE usersecuinfo SET salt = #{salt} WHERE user_id = #{userId}")
	boolean updateSalt(String userId, String salt);
}
