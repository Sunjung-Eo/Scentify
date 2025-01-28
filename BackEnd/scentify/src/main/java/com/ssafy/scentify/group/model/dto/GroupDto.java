package com.ssafy.scentify.group.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

public class GroupDto {
	
	@Data
    @AllArgsConstructor
    public static class CreateDto {
        private Integer id;   
        private Integer deviceId;
        private String adminId;  
        private String adminNickname; 
    }
}
