package com.ssafy.scentify.favorite;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.favorite.model.repository.FavoriteRepository;

@Service
public class FavoriteService {
	
	private final FavoriteRepository favoriteRepository;
	
	public FavoriteService(FavoriteRepository favoriteRepository) {
		this.favoriteRepository = favoriteRepository;
	}

	public boolean addCombinationToFavorites(String userId, int combinationId) {
		return favoriteRepository.addCombinationToFavorites(userId, combinationId);
	}

}
