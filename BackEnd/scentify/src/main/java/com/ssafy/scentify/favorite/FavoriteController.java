package com.ssafy.scentify.favorite;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.combination.CombinationController;
import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.favorite.model.dto.CommentRequest;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.FavoriteListDto;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.FavoriteListResponseDto;
import com.ssafy.scentify.favorite.model.dto.ImageGenerationResponse;
import com.ssafy.scentify.favorite.model.dto.ImageGenerationResponse.ImageURL;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/favorite")
@RestController
public class FavoriteController {
	
	private final FavoriteService favoriteService;
	private final CombinationService combinationService;
	private final OpenAIService aiService;
	private final S3Service s3Service;
	private final TokenProvider tokenProvider;
	
	public FavoriteController(FavoriteService favoriteService, CombinationService combinationService, OpenAIService aiService, S3Service s3Service, TokenProvider tokenProvider) {
		this.favoriteService = favoriteService;
		this.combinationService = combinationService;
		this.aiService = aiService;
		this.s3Service = s3Service;
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
			 
			 // 찜할 조합 리스트를 추출
			 List<Integer> combinationIds = combinationIdsMap.get("combinationIds");
			 
			 // 찜 리스트에 추가
			 for (int combinationId : combinationIds) {
				if (favoriteService.existsByCombinationId(userId, combinationId)) {
					continue;
				}
				 
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
	
	// API 56번 : 찜 리스트 전체 조회
	@PostMapping("/all")
	public ResponseEntity<?> getAllFavorites(@RequestHeader("Authorization") String authorizationHeader) {
		try {
			// "Bearer " 제거
			if (!authorizationHeader.startsWith("Bearer ")) {
			    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
			String token = authorizationHeader.substring(7);
			
			// 토큰에서 id 추출
			String userId = tokenProvider.getId(token);
			
			// 찜 리스트 DB 조회
			FavoriteListResponseDto response = new FavoriteListResponseDto();
			List<FavoriteListDto> favorites = favoriteService.getAllFavorites(userId);
			response.setFavorites(favorites);
			
			return new ResponseEntity<>(response, HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 57번 : 찜 삭제하기
	@PostMapping("/delete")
	public ResponseEntity<?> removeCombinationFromFavorites(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, Integer> favoriteMap) {
		try {
			// "Bearer " 제거
			if (!authorizationHeader.startsWith("Bearer ")) {
			    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
			String token = authorizationHeader.substring(7);
			
			// 토큰에서 id 추출
			String userId = tokenProvider.getId(token);
			 
			// 삭제 요청하는 찜 id
			Integer favoriteId = favoriteMap.get("id");
			if (favoriteId == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			 
			// 찜 삭제 (실패 시 400 반환)
			if (!favoriteService.deleteFavorite(favoriteId, userId)) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	@PostMapping("/share")
	public ResponseEntity<?>  sendComment(Locale locale, HttpServletRequest request, HttpServletResponse response, @RequestBody Map<String, Integer> combinationIdMap) {
        Integer combinationId = combinationIdMap.get("combinationId");
        if (combinationId == null) {
        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        CombinationDto combination = combinationService.getCombinationById(combinationId);
        if (combination == null) {
        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        ImageGenerationResponse imageGenerationResponse = aiService.makeImages(combination);
        return ResponseEntity.ok(imageGenerationResponse.getData());
    }
}
