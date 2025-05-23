package com.ssafy.scentify.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class TokenService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // Refresh Token 저장
    public void saveRefreshToken(String userId, String refreshToken) {
        redisTemplate.opsForValue().set("refreshToken:" + userId, refreshToken, Duration.ofDays(1));
    }

    // Refresh Token 검증
    public boolean validateRefreshToken(String userId, String refreshToken) {
        String storedToken = redisTemplate.opsForValue().get("refreshToken:" + userId);
        return storedToken != null && storedToken.equals(refreshToken);
    }
    
    // Refresh Token 삭제 
    public void deleteRefreshToken(String userId) {
        redisTemplate.delete("refreshToken:" + userId);
    }

    // 블랙리스트 추가
    public void addToBlacklist(String accessToken, long expirationTimeInMillis) {
        redisTemplate.opsForValue().set("blacklist:" + accessToken, "true", Duration.ofMillis(expirationTimeInMillis));
    }

    // 블랙리스트 확인
    public boolean isBlacklisted(String accessToken) {
        return redisTemplate.hasKey("blacklist:" + accessToken);
    }
}
