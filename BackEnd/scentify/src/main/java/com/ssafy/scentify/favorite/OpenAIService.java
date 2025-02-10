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
    	
    	List<Integer> scentNum = new ArrayList<>();
    	
    	
    	String comment = "Draw a cocktail with" + "Line drawing. Make sure to add color";
    	
    	
    	CommentRequest commentRequest = new CommentRequest();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.parseMediaType(ChatGptConfig.MEDIA_TYPE));
        httpHeaders.add(ChatGptConfig.AUTHORIZATION, ChatGptConfig.BEARER + openaiApiKey);

        ImageGenerationRequest imageGenerationRequest = ImageGenerationRequest.builder()
                																.prompt(commentRequest.getComment())
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
