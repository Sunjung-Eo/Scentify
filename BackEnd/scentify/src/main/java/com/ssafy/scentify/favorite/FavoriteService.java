package com.ssafy.scentify.favorite;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.common.config.ChatGptConfig;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.FavoriteListDto;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.FavoriteListResponseDto;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.ImageGenerationRequest;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.ImageGenerationResponse;
import com.ssafy.scentify.favorite.model.repository.FavoriteRepository;

import jakarta.annotation.PostConstruct;

@Service
public class FavoriteService {

	private final FavoriteRepository favoriteRepository;
	
	public FavoriteService(FavoriteRepository favoriteRepository) {
		this.favoriteRepository = favoriteRepository;
		
	}

	public boolean addCombinationToFavorites(String userId, int combinationId) {
		return favoriteRepository.addCombinationToFavorites(userId, combinationId);
	}

	public boolean deleteFavorite(int combinationId, String userId) {
		return favoriteRepository.deleteFavorite(combinationId, userId);
	}

	public List<FavoriteListDto> getAllFavorites(String userId) {
		return favoriteRepository.getAllFavorites(userId);
	}
	
	public List<Integer> getAllFavoriteIds(String userId) {
		return favoriteRepository.getAllFavoriteIds(userId);
	}

	public boolean existsByCombinationId(String userId, int combinationId) {
		return favoriteRepository.existsByCombinationId(userId, combinationId);
	}
	
}
