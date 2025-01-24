package com.ssafy.scentify.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
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
	
	@Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // 구독 엔드포인트
        config.setApplicationDestinationPrefixes("/app"); // 클라이언트 요청 prefix
    }
	
	@Override
    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        messageConverters.add(new MappingJackson2MessageConverter());
        return false; // true일 경우 기본 컨버터 사용 안 함
    }
}
