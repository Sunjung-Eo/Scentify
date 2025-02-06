package com.ssafy.scentify.favorite;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.combination.CombinationController;
import com.ssafy.scentify.common.util.TokenProvider;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/favorite")
@RestController
public class FavoriteController {
	
	private final FavoriteService favoriteService;
	private final TokenProvider tokenProvider;
	
	public FavoriteController(FavoriteService favoriteService, TokenProvider tokenProvider) {
		this.favoriteService = favoriteService;
		this.tokenProvider = tokenProvider;
	}
	
	// API 55번 : 조합 찜하기
	@PostMapping("/create")
	public ResponseEntity<?> addCombinationToFavorites(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, List<Integer>> combinationIdsMap) {
		try {
			 // "Bearer " 제거
			 if (!authorizationHeader.startsWith("Bearer ")) {
			     return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			 }
			 String token = authorizationHeader.substring(7);
			
			 // 토큰에서 id 추출
			 String userId = tokenProvider.getId(token);
			 List<Integer> combinationIds = combinationIdsMap.get("combinationIds");
			 
			 // 찜 리스트에 추가
			 for (int combinationId : combinationIds) {
				if (!favoriteService.addCombinationToFavorites(userId, combinationId)) {
					return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
				}
			 }
			 
			 return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
