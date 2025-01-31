package com.ssafy.scentify.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import com.ssafy.scentify.handler.WebSocketHandler;
import com.ssafy.scentify.interceptor.WebSocketInterceptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	
	private final WebSocketInterceptor socketInterceptor;
	private final WebSocketHandler socketHandler;
	
	public WebSocketConfig(WebSocketInterceptor socketInterceptor, WebSocketHandler socketHandler) {
		this.socketInterceptor = socketInterceptor;
		this.socketHandler = socketHandler;
	}
	
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/v1/ws/device")
				.addInterceptors(socketInterceptor)
				.setAllowedOrigins("*")
				.setAllowedOriginPatterns("*");
	}
}
