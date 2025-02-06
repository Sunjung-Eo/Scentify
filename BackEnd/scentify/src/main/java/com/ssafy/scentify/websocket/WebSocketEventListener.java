package com.ssafy.scentify.websocket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class WebSocketEventListener {

    private final WebSocketSessionManager sessionManager;

    public WebSocketEventListener(WebSocketSessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    // STOMP WebSocket 연결 감지 (serial 저장)
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String serial = (String) headerAccessor.getSessionAttributes().get("serial");

        if (serial != null) {
            sessionManager.registerSession(serial, headerAccessor.getSessionId());
            log.info("WebSocket 세션 등록 - serial: {}, sessionId: {}", serial, headerAccessor.getSessionId());
        }
    }

    // STOMP WebSocket 연결 종료 감지 (serial 기반으로 세션 종료)
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String serial = (String) headerAccessor.getSessionAttributes().get("serial");

        if (serial != null) {
            sessionManager.closeSession(serial);
            log.info("WebSocket 세션 종료 - serial: {}", serial);
        }
    }
}
