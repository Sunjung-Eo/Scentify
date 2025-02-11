package com.ssafy.scentify.favorite;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.common.config.ChatGptConfig;
import com.ssafy.scentify.favorite.model.dto.CommentRequest;
import com.ssafy.scentify.favorite.model.dto.ImageGenerationRequest;
import com.ssafy.scentify.favorite.model.dto.ImageGenerationResponse;

import jakarta.annotation.PostConstruct;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {
	
	private final Map<Integer, String> scentMap = new HashMap<>();
	
	@PostConstruct
    public void init() {
        scentMap.put(0, "Lemon");
        scentMap.put(1, "Eucalyptus");
        scentMap.put(2, "Peppermint");
        scentMap.put(3, "Lavender");
        scentMap.put(4, "Cedarwood");
        scentMap.put(5, "Chamomile");
        scentMap.put(6, "Sandalwood");
        scentMap.put(7, "White Musk");
        scentMap.put(8, "Orange Blossom");
    }
	
    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final RestTemplate restTemplate;

    public OpenAIService(RestTemplateBuilder restTemplateBuilder) {
         this.restTemplate = restTemplateBuilder.build();
    }

    public ImageGenerationResponse makeImages(CombinationDto combination){  	
    	List<String> scentName = new ArrayList<>();
    	scentName.add(scentMap.get(combination.getChoice1())); 
    	if (combination.getChoice2() != null) { scentName.add(scentMap.get(combination.getChoice2())); }
    	if (combination.getChoice3() != null) { scentName.add(scentMap.get(combination.getChoice3())); }
    	if (combination.getChoice4() != null) { scentName.add(scentMap.get(combination.getChoice4())); }
    	
    	StringBuilder comment = new StringBuilder("Draw a cocktail picture using ");

    	for (String name : scentName) {
    		comment.append(" ").append(name).append(",");
    	}

    	// 마지막 문자 제거 (반점 삭제)
    	if (comment.charAt(comment.length() - 1) == ',') {
    		comment.deleteCharAt(comment.length() - 1);
    	}
    	
    	comment.append(". Make sure you draw only one cocktail.");
    	comment.append(" Never write letters on a picture.");
    	comment.append(" The cocktail glass in the picture must be in the middle.");
    	comment.append(" The size of the picture cannot exceed 525 pixels * 525 pixels.");
    	comment.append(" The color of the painting must be painted.");
    	
    	CommentRequest commentRequest = new CommentRequest();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.parseMediaType(ChatGptConfig.MEDIA_TYPE));
        httpHeaders.add(ChatGptConfig.AUTHORIZATION, ChatGptConfig.BEARER + openaiApiKey);

        ImageGenerationRequest imageGenerationRequest = ImageGenerationRequest.builder()
                																.prompt(comment.toString())
                																.n(ChatGptConfig.IMAGE_COUNT)
                																.size(ChatGptConfig.IMAGE_SIZE)
                																.build();
        HttpEntity<ImageGenerationRequest> requestHttpEntity = new HttpEntity<>(imageGenerationRequest, httpHeaders);

        ResponseEntity<ImageGenerationResponse> responseEntity = restTemplate.postForEntity(
																	                ChatGptConfig.IMAGE_URL,
																	                requestHttpEntity,
																	                ImageGenerationResponse.class
																	        	);
        return responseEntity.getBody();
    }
}
