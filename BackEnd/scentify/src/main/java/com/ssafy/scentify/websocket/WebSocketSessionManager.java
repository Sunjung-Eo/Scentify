package com.ssafy.scentify.websocket;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
public class WebSocketSessionManager {

    private final Map<String, String> sessionMap = new ConcurrentHashMap<>();

    // STOMP 세션 등록 (WebSocketSession이 아닌 Session ID 저장)
    public void registerSession(String serial, String sessionId) {
        sessionMap.put(serial, sessionId);
    }

    // STOMP 세션 종료 (Session ID를 기반으로 관리)
    public void closeSession(String serial) {
        sessionMap.remove(serial);
    }

    // 세션 제거 (연결이 종료될 때 호출)
    public void removeSession(String serial) {
        sessionMap.remove(serial);
    }

    // 특정 serial의 세션 ID 조회
    public String getSessionId(String serial) {
        return sessionMap.get(serial);
    }
}

