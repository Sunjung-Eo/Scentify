package com.ssafy.scentify.user.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GoogleService {
	
	@Value("${google.client.id}")
    private String clientId;
    
    @Value("${google.client.secret}")
    private String clientSecret;
    
    @Value("${google.redirect.uri}")
    private String redirectUri;

	public Map<String, Object> googleAccessToken(String code) {
        try {
			GoogleTokenResponse googleTokenResponse = new GoogleAuthorizationCodeTokenRequest(
									                    new NetHttpTransport(),
									                    new GsonFactory(),
									                    "https://oauth2.googleapis.com/token",
									                    clientId,
									                    clientSecret,
									                    code,
									                    redirectUri)
									                    .execute();
	
	        GoogleIdToken googleIdToken = googleTokenResponse.parseIdToken();
	        if (googleIdToken == null) {
	            throw new IllegalArgumentException("Invalid ID token");
	        }
	
	        GoogleIdToken.Payload payload = googleIdToken.getPayload();
	        String accessToken = googleTokenResponse.getAccessToken();
	        String refreshToken = googleTokenResponse.getRefreshToken();
	
	        Map<String, Object> result = new HashMap<>();
	        result.put("payload", payload);
	        result.put("accessToken", accessToken);
	        result.put("refreshToken", refreshToken);
	        return result;
	        
        } catch (Exception e) {
        	// 예기치 못한 에러 처리
        	log.error("Exception: ", e);
        	return null;
        }
	}

	public String[] getGoogleUserInfo(Payload payload) {
		String id = (String) payload.get("sub");
    	String email = payload.getEmail();
    	
    	if (id == null || email == null) {
            throw new IllegalArgumentException("google 아이디랑 이메일 정보 없음");
        }
    	
    	String[] userInfo = new String[2];
    	userInfo[0] = id;
    	userInfo[1] = email;
		return userInfo;
	}

}
