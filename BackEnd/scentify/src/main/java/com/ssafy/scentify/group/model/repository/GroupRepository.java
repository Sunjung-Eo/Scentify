package com.ssafy.scentify.group.model.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.ssafy.scentify.group.model.dto.GroupDto.CreateDto;
import com.ssafy.scentify.group.model.dto.GroupDto.MemberDto;
import com.ssafy.scentify.group.model.entity.Group;

@Mapper
public interface GroupRepository {
	
	// 그룹을 생성하는 메서드
	@Insert("INSERT INTO `group` (device_id, admin_id, admin_nickname) VALUES (#{deviceId}, #{adminId}, #{adminNickname})")
	@Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
	boolean createGroup(CreateDto group);
	
	// 멤버 1 ~ 4 중 null인 곳에 저장하는 메서드
	boolean updateMember(MemberDto memberDto);
	
	// 그룹 id에 해당하는 그룹 정보 반환
	@Select("SELECT * FROM `group` WHERE id = #{id}")
	Group selectGroupById(Integer id);
	
	// 디바이스 id에 해당하는 그룹 정보 반환
	@Select("SELECT * FROM `group` WHERE device_id = #{mainDeviceId}")
	Group getGroup(int mainDeviceId);
	
	// 유저가 속해있는 그룹의 디바이스 아이디 반환
	@Select("SELECT device_id FROM `group` WHERE admin_id = #{userId}"
			+ "OR member_1_id = #{userId} OR member_2_id = #{userId}"
			+ "OR member_3_id = #{userId} OR member_4_id = #{userId};")
	List<Integer> getDeviceIdByUserId(String userId);
	
	// 모든 그룹 멤버를 null로 업데이트
	@Update("UPDATE `group` SET member_1_id = NULL, member_1_nickname = NULL, member_2_id = NULL, member_2_nickname = NULL,"
		    + "member_3_id = NULL, member_3_nickname = NULL, member_4_id = NULL, member_4_nickname = NULL WHERE id = #{id}")
	boolean updateGroupAllMemberById(Integer id);
	
	// 특정 그룹 멤버를 null로 업데이트
	@Update("UPDATE `group` SET ${memberPosition}_id = NULL, ${memberPosition}_nickname = NULL WHERE id = #{id}")
	boolean updateGroupMemberById(Integer id, String memberPosition);
}
