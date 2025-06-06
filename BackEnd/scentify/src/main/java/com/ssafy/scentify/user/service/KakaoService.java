package com.ssafy.scentify.user.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.scentify.user.model.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class KakaoService {
	
	@Value("${kakao.api-key}")
	private String kakaoApiKey; 
	
	@Value("${kakao.redirect.url}")
	private String kakaoRedirectUrl;
	
	static final String kakaoTokenReqURL = "https://kauth.kakao.com/oauth/token";
	static final String kakaoCreateReqURL = "https://kapi.kakao.com/v2/user/me";
	static final String kakaoGetInfoReqURL = "https://kapi.kakao.com/v2/user/me";
	static final String kakaoLogoutReqURL = "https://kapi.kakao.com/v1/user/logout";	
	static final String kakaoDeleteReqURL = "https://kapi.kakao.com/v1/user/unlink";
	static final String kakaoRefeshTokenReqURL = "https://kauth.kakao.com/oauth/token";

	
	private final UserRepository userRepository;
	public KakaoService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public String[] getKakaoAccessToken(String code) {
		HttpClient client = HttpClient.newHttpClient();
        String requestBody = String.format("grant_type=authorization_code&client_id=%s&redirect_uri=%s&code=%s", kakaoApiKey, kakaoRedirectUrl, code);
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(kakaoTokenReqURL)).header("Content-Type", "application/x-www-form-urlencoded").POST(HttpRequest.BodyPublishers.ofString(requestBody)).build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.body());
                
                String[] tokens = new String[2];
                tokens[0] = rootNode.path("refresh_token").asText();
                tokens[1] =  rootNode.path("access_token").asText();
                
                return tokens;
            }
            
        } catch (IOException | InterruptedException e) {
        	log.error("IOException: ", e);
        }       
		return null;
	}

	public String[] getKakaoUserInfo(String accessToken) {
		HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(kakaoGetInfoReqURL)).header("Authorization", "Bearer " + accessToken).GET().build();
        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response.body());
                
                String[] userInfo = new String[2];
                userInfo[0] = String.valueOf(rootNode.path("id").asInt());
                boolean hasEmail = rootNode.path("kakao_account").path("has_email").asBoolean();
                userInfo[1] = hasEmail ? rootNode.path("kakao_account").path("email").asText() : "";               
                return userInfo; 
            } 
            
        } catch (IOException | InterruptedException e) {
        	log.error("IOException: ", e);
        }
        
        return null;
	}

}
