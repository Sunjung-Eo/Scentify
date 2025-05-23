package com.ssafy.scentify.websocket;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class HandshakeStateManager {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String HANDSHAKE_PREFIX = "handshake:";

    @Autowired
    public HandshakeStateManager(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void setHandshakeState(String serial, boolean state, long timeoutInSeconds) {
        String key = HANDSHAKE_PREFIX + serial;
        redisTemplate.opsForValue().set(key, state, timeoutInSeconds, TimeUnit.SECONDS);
    }

    public boolean getHandshakeState(String serial) {
        String key = HANDSHAKE_PREFIX + serial;
        Boolean state = (Boolean) redisTemplate.opsForValue().get(key);
        return state != null && state;
    }

    public void removeHandshakeState(String serial) {
        String key = HANDSHAKE_PREFIX + serial;
        redisTemplate.delete(key);
    }
}
