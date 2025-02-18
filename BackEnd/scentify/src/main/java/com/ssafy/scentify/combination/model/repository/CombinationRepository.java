package com.ssafy.scentify.combination.model.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest.Combination;

@Mapper
public interface CombinationRepository {
	
	// combination 등록
	@Insert("INSERT INTO combination (id, name, choice1, choice1_count, choice2, choice2_count, choice3, choice3_count, choice4, choice4_count)"
    		+ "VALUES (#{combinationId}, #{combination.name}, #{combination.choice1}, #{combination.choice1Count}, #{combination.choice2}, #{combination.choice2Count}, "
    		+ "#{combination.choice3}, #{combination.choice3Count}, #{combination.choice4}, #{combination.choice4Count})")
	boolean createCombination(int combinationId, @Param("combination") CombinationDto combination);

	// autoCombination 등록
	@Insert("INSERT INTO combination (id, name, choice1, choice1_count)"
    		+ "VALUES (#{combinationId}, #{name}, #{choice}, #{count})")
	boolean createAutoCombination(int combinationId, String name, int choice, int count);
	
	// id로 조합 정보 반환
	@Select("SELECT id, name, choice1, choice1_count, choice2, choice2_count, choice3, choice3_count, choice4, choice4_count, img_url " 
		    + "FROM combination WHERE id = #{combinationId}")
	CombinationDto getCombinationById(int combinationId);
	
	// id로 id와 name을 제외한 조합 정보 반환
	@Select("SELECT choice1, choice1_count, choice2, choice2_count, choice3, choice3_count, choice4, choice4_count " 
		    + "FROM combination WHERE id = #{combinationId}")
	Combination getSocketCombinationById(Integer combinationId);
	
	// id로 조합 정보 업데이트
	@Update("UPDATE combination SET choice1 = #{combination.choice1}, choice1_count = #{combination.choice1Count}, choice2 = #{combination.choice2}, choice2_count = #{combination.choice2Count}, "
			+ "choice3 = #{combination.choice3}, choice3_count = #{combination.choice3Count}, choice4 = #{combination.choice4}, choice4_count = #{combination.choice4Count} WHERE id = #{combination.id}")
	boolean updateCombination(@Param("combination") CombinationDto combination);
}
