package com.ssafy.scentify.websocket;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.DeviceService;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class WebSocketInterceptor implements HandshakeInterceptor, ChannelInterceptor {
	
	private final DeviceService deviceService;
	private final HandshakeStateManager stateManager;
    private final TokenProvider tokenProvider;
    private static final ConcurrentHashMap<String, Long> LAST_HEARTBEAT = new ConcurrentHashMap<>();
    private static final long TIMEOUT = 30_000; // 30초 이상 heartbeat 없으면 종료

    public WebSocketInterceptor(DeviceService deviceService, HandshakeStateManager stateManager, TokenProvider tokenProvider) {
    	this.deviceService = deviceService;
        this.stateManager = stateManager;
    	this.tokenProvider = tokenProvider;
    }
    
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
    	log.info("beforeHandshake called");
    	
    	// 헤더에서 Authorization 추출
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();

            String authHeader = httpRequest.getHeader("Authorization");
            
	         // null 체크와 "Bearer " 시작 여부를 분리
	         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	             return false;
	         }

            String token = authHeader.substring(7); // "Bearer " 이후의 토큰 값 추출
            log.info("token : {}" + token);
                
            // 토큰 검증 로직
            try {
            	tokenProvider.validateJwtToken(token);
            } catch (ExpiredJwtException e) {
            	return false;
            }
            
            String serial = tokenProvider.getSerial(token);
            log.info("serial : {}" + serial);
            
            if (!deviceService.selectDeviceBySerial(serial)) {
            	response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return false;
            }
            
            // 핸드쉐이크 상태를 Redis에 저장 (유효 시간: 300초)
            stateManager.setHandshakeState(serial, true, 300);
            return true;
            
        }
        return false; // ServletServerHttpRequest가 아닌 경우
    }
    
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
    	
    }
    
    // Heartbeat를 체크하고 만약 연결이 끊어졌다면 제거
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (accessor.getCommand() == null) {
            // Heartbeat 메시지 처리 (command가 없음)
            String sessionId = accessor.getSessionId();
            LAST_HEARTBEAT.put(sessionId, System.currentTimeMillis());
            return message;
        }

        switch (accessor.getCommand()) {
            case CONNECT:
                log.info("Client connected: {}", accessor.getSessionId());
                LAST_HEARTBEAT.put(accessor.getSessionId(), System.currentTimeMillis());
                break;
            case DISCONNECT:
                log.info("Client disconnected: {}", accessor.getSessionId());
                LAST_HEARTBEAT.remove(accessor.getSessionId());
                break;
            default:
                break;
        }
        return message;
    }

    // 15초마다 세션 검사 → 30초 이상 Heartbeat 없으면 세션 제거
    @Scheduled(fixedRate = 15_000)
    public void checkForInactiveSessions() {
        long now = System.currentTimeMillis();

        LAST_HEARTBEAT.forEach((sessionId, lastHeartbeat) -> {
            if (now - lastHeartbeat > TIMEOUT) {
                log.warn("세션 {} 타임아웃 - 강제 종료", sessionId);
                LAST_HEARTBEAT.remove(sessionId);
            }
        });
    }
}

