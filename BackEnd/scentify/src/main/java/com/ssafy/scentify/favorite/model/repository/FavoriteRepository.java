package com.ssafy.scentify.favorite.model.repository;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoriteRepository {
	
	// 찜 추가
	@Insert("INSERT INTO favorite (user_id, combination_id) VALUES (#{userId}, #{combinationId})")
	boolean addCombinationToFavorites(String userId, int combinationId);
	
	// 찜 삭제
	@Delete("DELETE FROM favorite WEHRE id = #{id}, user_id = #{userId}")
	boolean deleteFavorite(int id, String userId);
	
}
