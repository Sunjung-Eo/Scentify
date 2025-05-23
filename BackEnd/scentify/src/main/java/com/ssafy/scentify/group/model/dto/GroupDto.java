package com.ssafy.scentify.group.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class GroupDto {
	
	@Data
    @AllArgsConstructor
    public static class CreateDto {
        private Integer id;   
        private int deviceId;
        private String adminId;  
        private String adminNickname; 
    }
	
	@Data
    @AllArgsConstructor
    public static class MemberDto {
        private Integer id;   
        private String memberId;  
        private String memberNickname; 
    }
	
	@Getter
	@AllArgsConstructor
	public static class DeleteMemberDto {
		@Setter
		private int groupId;
		private String memberId;
		
		public void setMemberId(String memberId) {
	        if (memberId == null || memberId.isBlank() || memberId.contains(" ") || memberId.length() > 30) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.memberId = memberId;
	    }
	}
}
