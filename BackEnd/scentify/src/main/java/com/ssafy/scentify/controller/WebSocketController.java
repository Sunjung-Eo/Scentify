package com.ssafy.scentify.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import com.ssafy.scentify.model.dto.WebSocketDto.ModeChangeRequest;

@Controller
public class WebSocketController {
	
	@MessageMapping("/mode/change")
    public void handleModeChange(@Payload ModeChangeRequest request) {
        switch (request.getType()) {
            case "ModeChange":
                System.out.println("*");
                break;
            default:
                
                break;
        }
    }
}
