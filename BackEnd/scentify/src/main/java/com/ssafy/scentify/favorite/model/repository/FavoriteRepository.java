package com.ssafy.scentify.favorite.model.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.ssafy.scentify.favorite.model.dto.FavoriteDto.FavoriteListDto;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.FavoriteListResponseDto;

@Mapper
public interface FavoriteRepository {
	
	// 찜 추가
	@Insert("INSERT INTO favorite (user_id, combination_id) VALUES (#{userId}, #{combinationId})")
	boolean addCombinationToFavorites(String userId, int combinationId);
	
	// 찜 삭제
	@Delete("DELETE FROM favorite WHERE id = #{id} AND user_id = #{userId}")
	boolean deleteFavorite(int id, String userId);
	
	// 별도의 매퍼에 구현
	List<FavoriteListDto> getAllFavorites(String userId);
	
	// 이미 찜 등록된 combination id인지 검사
	@Select("SELECT COUNT(*) > 0 FROM favorite WHERE user_id = #{userId} AND combination_id = #{combinationId}")
	boolean existsByCombinationId(String userId, int combinationId);	
}
