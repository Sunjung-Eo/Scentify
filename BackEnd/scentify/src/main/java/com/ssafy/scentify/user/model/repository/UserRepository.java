package com.ssafy.scentify.user.model.repository;

import java.sql.Date;

import org.apache.ibatis.annotations.*;

import com.ssafy.scentify.home.model.dto.HomeDto.UserHomeDto;
import com.ssafy.scentify.user.model.dto.UserDto.SocialLoginDto;
import com.ssafy.scentify.user.model.dto.UserDto.UserInfoDto;
import com.ssafy.scentify.user.model.entity.User;

@Mapper
public interface UserRepository {   
    // 유저 생성
    @Insert("INSERT INTO user (id, password, nickname, email, img_num, social_type, gender, birth)"
    		+ "VALUES (#{id}, #{password}, #{nickname}, #{email}, #{imgNum}, #{socialType}, #{gender}, #{birth})")
	boolean createUser(User user);
	
    // ID 존재 여부 확인
    @Select("SELECT COUNT(*) > 0 FROM user WHERE id = #{id}")
    boolean existsById(String id);

    // 이메일 존재 여부 확인
    @Select("SELECT COUNT(*) > 0 FROM user WHERE email = #{email}")
    boolean existsByEmail(String email);

    // id로 유저 비밀번호 찾기
    @Select("SELECT password FROM user WHERE id = #{id}")
	String getUserPasswordById(String id);
    
    // email로 유저 id 가져오기
    @Select("SELECT id, social_type FROM user WHERE email = #{email}")
    SocialLoginDto getSocialUserInfoByEmail(String email);
    
    // id로 유저 성별과 생년월일 가져오기
	@Select("SELECT gender, birth FROM user WHERE id = #{id}")
    UserInfoDto getUserInfoById(String id);
	
	// id로 홈탭에서 반환할 유저 정보 받아오기 (닉네임, 이미지 번호, 메인 기기 아이디)
	@Select("SELECT nickname, img_num, main_device_id FROM user WHERE id = #{id}")
	UserHomeDto getUserHomeInfoById(String id);
	
	// id로 유저 닉네임 가져오기
	@Select("SELECT nickname FROM user WHERE id = #{id}")
	String getUserNickNameById(String id);
	
	// id로 유저 이메일 가져오기
	@Select("SELECT email FROM user WHERE id = #{id}")
	String getUserEmailById(String id);
	
	// id로 유저 메인 디바이스 가져오기
	@Select("SELECT main_device_id FROM user WHERE id = #{id}")
	Integer getMainDeviceById(String id);
	
	// id에 해당하는 유저의 nickName 업데이트
	@Update("UPDATE user SET nickname = #{nickname} WHERE id = #{id}")
	boolean updateUserNickName(String id, String nickname);
	
	// id에 해당하는 유저의 성별과 생년월일 업데이트
	@Update("UPDATE user SET gender = #{gender}, birth = #{birth} WHERE id = #{id}")
	boolean updateUserInfo(String id, Integer gender, Date birth);

	// id에 해당하는 유저의 사진 번호 업데이트
	@Update("UPDATE user SET img_num = #{imgNum} WHERE id = #{id}")
	boolean updateUserImgNum(String id, Integer imgNum);
	
	// id에 해당하는 유저의 비밀번호 업데이트
	@Update("UPDATE user SET password = #{password} WHERE id = #{id}")
	boolean updatePassword(String id, String password);

	// 기기 등록 시 mainDeviceId가 없는 유저의 경우 자동으로 mainDevice 설정
	@Update("UPDATE user SET main_device_id = #{deviceId} WHERE id = #{userId} AND main_device_id IS NULL")
	boolean updateMainDeviceId(String userId, Integer deviceId);
	
	// 대표기기 설정 시 값이 있더라도 변경
	@Update("UPDATE user SET main_device_id = #{deviceId} WHERE id = #{userId}")
	boolean forceUpdateMainDeviceId(String userId, Integer deviceId);
	
	// id에 해당하는 유저의 계정 삭제
	@Delete("DELETE FROM user WHERE id = #{id}")
	boolean deleteUser(String id);
}
