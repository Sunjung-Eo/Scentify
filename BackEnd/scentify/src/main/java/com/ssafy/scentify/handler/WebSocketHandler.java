package com.ssafy.scentify.handler;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class WebSocketHandler extends TextWebSocketHandler {
	
	private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();

	@Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        CLIENTS.put(session.getId(), session);
        log.info("웹소켓 연결 성공 - serial");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("수신 메세지 : {}" + payload);
        session.sendMessage(new TextMessage("Echo: " + payload));
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    	CLIENTS.remove(session.getId());
    }
}
