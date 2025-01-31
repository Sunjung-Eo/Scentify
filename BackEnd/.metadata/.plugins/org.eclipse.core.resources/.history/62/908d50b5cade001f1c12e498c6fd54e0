package com.ssafy.scentify.combination.model.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.ssafy.scentify.device.model.dto.DeviceDto.defaultCombinationDto;
import com.ssafy.scentify.device.model.dto.DeviceDto.defaultCombinationDto.Combination;

@Mapper
public interface CombinationRepository {
	
	// combination 등록
	@Insert("INSERT INTO combination (id, choice1, choice1_count, choice2, choice2_count, choice3, choice3_count, choice4, choice4_count)"
    		+ "VALUES (#{combinationId}, #{combination.choice1}, #{combination.choice1Count}, #{combination.choice2}, #{combination.choice2Count}, "
    		+ "#{combination.choice3}, #{combination.choice3Count}, #{combination.choice4}, #{combination.choice4Count})")
	boolean createCombination(int combinationId, @Param("combination") defaultCombinationDto.Combination combination);

	// autoCombination 등록
	@Insert("INSERT INTO combination (id, choice1, choice1_count)"
    		+ "VALUES (#{combinationId}, #{choice}, #{count})")
	boolean createAutoCombination(int combinationId, int choice, int count);
	
	// id로 조합 정보 반환
	@Select("SELECT name, choice1, choice1_count, choice2, choice2_count, choice3, choice3_count, choice4, choice4_count " 
		    + "FROM combination WHERE id = #{combinationId}")
	Combination getCombinationById(int combinationId);
}
