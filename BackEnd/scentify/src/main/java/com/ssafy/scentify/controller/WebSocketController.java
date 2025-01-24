package com.ssafy.scentify.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.ssafy.scentify.model.dto.WebSocketDto.ModeChangeRequest;
import com.ssafy.scentify.model.dto.WebSocketDto.TempHumRequest;

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
//	
//	@MessageMapping("/DeviceStatus/Sensor/TempHum")
//    public Response handleDeviceStatus(@Payload TempHumRequest request) {
//        System.out.println("수신된 데이터: " + request);
//        return new ResponseMessage(200);
//    }
}
