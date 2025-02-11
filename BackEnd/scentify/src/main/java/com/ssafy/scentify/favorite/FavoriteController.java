package com.ssafy.scentify.favorite;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.combination.CombinationController;
import com.ssafy.scentify.combination.CombinationService;
import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.common.service.AIService;
import com.ssafy.scentify.common.service.S3Service;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.FavoriteListDto;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.FavoriteListResponseDto;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.ImageGenerationResponse;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.ImageGenerationResponse.ImageData;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.ReadCombination;
import com.ssafy.scentify.favorite.model.dto.FavoriteDto.ShareCombination;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/v1/favorite")
@RestController
public class FavoriteController {
	
	private final FavoriteService favoriteService;
	private final CombinationService combinationService;
	private final AIService aiService;
	private final S3Service s3Service;
	private final TokenProvider tokenProvider;
	
	public FavoriteController(FavoriteService favoriteService, CombinationService combinationService, AIService aiService, S3Service s3Service, TokenProvider tokenProvider) {
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
	
	// API 58번 : 찜 조합 공유
	@PostMapping("/share")
	public ResponseEntity<?>  shareFavoriteCombination(@RequestBody Map<String, Integer> combinationIdMap) {
       try {
			// combination id 추출 및 검사
			Integer combinationId = combinationIdMap.get("combinationId");
	        if (combinationId == null) {
	        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        
	        // 조합 DB에서 가져오기
	        CombinationDto combination = combinationService.getCombinationById(combinationId);
	        if (combination == null) {
	        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        
	        // open ai 키를 활용하여 이미지 생성
	        ImageGenerationResponse imageResponse = aiService.makeImages(combination);
	        
	        // s3 버킷에 업로드 후 링크 반환
	        List<String> s3Urls = new ArrayList();
	        List<String> imageNames = new ArrayList();
	        
	        for (ImageData imageData : imageResponse.getData()) {
	            try {
	                Map<String, String> s3Info = s3Service.downloadAndUploadImage(imageData.getUrl());
	                s3Urls.add(s3Info.get("s3Url"));
	                imageNames.add(s3Info.get("imageName"));
	                
	            } catch (Exception e) {
	                e.printStackTrace();
	                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	            }
	        }
	        
	        ShareCombination shareCombination = new ShareCombination();
	        shareCombination.setCombination(combination);
	        
	        // s3 url을 넣어줌
	        String s3Url = s3Urls.get(0);
	        shareCombination.setS3Url(s3Url);
	        
	        // s3에 업로드된 이미지 이름을 넣어줌
	        String imageName = imageNames.get(0);
	        String shareUrl = "http://localhost:5170/favorite/share/read?combinationId=" + combinationId + "&imageName=" + imageName;
	        shareCombination.setShareUrl(shareUrl);
	        
	        return ResponseEntity.ok(shareCombination);
	        
       } catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
    }
	
	// API 82번 : 공유된 찜 조합 조회
	@GetMapping("/share/read")
	public ResponseEntity<?>  readShareFavorite(@RequestParam("combinationId") Integer combinationId, @RequestParam("imageName") String imageName) {
		try {
			// 전달된 combinationId 검사
			if (combinationId == null) {
	        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
			
			// 조합 DB에서 가져오기
	        CombinationDto combination = combinationService.getCombinationById(combinationId);
	        if (combination == null) {
	        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        
	        // 해당 이미지 파일의 presigned url 생성
	        String imageUrl = s3Service.generatePresignedUrl(imageName, 10);
			if (imageUrl == null) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
	        
			// 응답 객체 생성
			ReadCombination response = new ReadCombination();
			response.setCombination(combination);
			response.setS3Url(imageUrl);
			
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
    }
}
