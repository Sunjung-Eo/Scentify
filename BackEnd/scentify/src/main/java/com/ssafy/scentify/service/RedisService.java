package com.ssafy.scentify.service;

import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisService {
	
	// String value을 redis에 저장하기 위한 template
    @Autowired
    private final StringRedisTemplate stringRedisTemplate;    
    
    public void setStringValue(String token, String data, Long expirationTime) {
        ValueOperations<String, String> stringValueOperations = stringRedisTemplate.opsForValue();
        stringValueOperations.set(token, data, (int) (expirationTime / 1), TimeUnit.MILLISECONDS);
    }

}
