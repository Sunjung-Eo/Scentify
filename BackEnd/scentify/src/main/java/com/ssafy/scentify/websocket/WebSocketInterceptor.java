package com.ssafy.scentify.websocket;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import com.google.api.client.json.webtoken.JsonWebSignature.Header;
import com.ssafy.scentify.auth.model.dto.TokenDto;
import com.ssafy.scentify.common.config.WebSocketConfig;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.device.DeviceService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import java.util.Map;

@Slf4j
@Component
public class WebSocketInterceptor implements HandshakeInterceptor {
	
	private final DeviceService deviceService;
    private final TokenProvider tokenProvider;

    public WebSocketInterceptor(DeviceService deviceService, TokenProvider tokenProvider) {
        this.deviceService = deviceService;
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
            if (!tokenProvider.vaildateJwtToken(token)) {
            	return false;
            }
            
            String serial = tokenProvider.getSerial(token);
            log.info("serial : {}" + serial);
            
            if (!deviceService.selectDeviceBySerial(serial)) {
            	response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return false;
            }
            
            attributes.put("serial", serial);
    		return true; // 핸드쉐이크 진행		
        }
        return false; // ServletServerHttpRequest가 아닌 경우
    }
    
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
    	
    }
    
}

