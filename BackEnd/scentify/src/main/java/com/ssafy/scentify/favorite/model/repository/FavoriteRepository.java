package com.ssafy.scentify.favorite.model.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoriteRepository {
	
	@Insert("INSERT INTO favorite (user_id, combination_id) VALUES (#{userId}, #{combinationId})")
	boolean addCombinationToFavorites(String userId, int combinationId);
	
}
