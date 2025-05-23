package com.ssafy.scentify.device.model.dto;

import java.util.UUID;
import java.util.regex.Pattern;

import com.ssafy.scentify.combination.model.dto.CombinationDto;

import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class DeviceDto {
	// - IPv4는 4개의 10진수 숫자로 구성되며 각 숫자는 0~255 사이.
	// - 각 숫자는 "."으로 구분됨.
	// - (25[0-5]): 250~255 범위의 숫자
	// - (2[0-4][0-9]): 200~249 범위의 숫자
	// - ([0-1]?[0-9][0-9]?): 0~199 범위의 숫자
	// - ^와 $: 문자열의 시작과 끝을 나타내, 전체 문자열이 이 형식과 일치해야 함.
	static final String ipRegex = "^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\." +
            						"(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\." +
            						"(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\." +
            						"(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$";
	static final Pattern ipPattern  = Pattern.compile(ipRegex);
	
	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class RegisterDto {
	    private Integer id;
		@NotBlank
		private String serial;
		private String adminId;
		@NotBlank
	    private String ipAddress;
		
		public void setId() {
			this.id = UUID.randomUUID().hashCode() & Integer.MAX_VALUE;
	    }

	    public void setSerial(String serial) {
	        if (serial == null || !serial.matches("[a-zA-Z0-9]{16}")) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.serial = serial;
	    }
	    
	    public void setAdminId(String adminId) {
	        if (adminId == null || adminId.isBlank() || adminId.length() > 30) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.adminId = adminId;
	    }
	    
	    public void setIpAddress(String ipAddress) {
	        if (ipAddress == null || !ipPattern.matcher(ipAddress).matches()) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.ipAddress = ipAddress;
	    }
	}
	
	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CapsuleInfo {
		@NotNull
	    private Integer id;
		@NotBlank
	    private String name;
		private int slot1;
		private int slot2;
		private int slot3;
		private int slot4;
		
		public void setName(String name) {
	        if (name == null || name.isBlank() || name.length() > 15) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.name = name;
	    }

		public void setSlot1(int slot1) {
	    	if (slot1 < 0 || slot1 > 2) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.slot1 = slot1;
	    }
	    
	    public void setSlot2(int slot2) {
	    	if (slot2 < 3 || slot2 > 5) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.slot2 = slot2;
	    }
	    
	    public void setSlot3(int slot3) {
	    	if (slot3 < 0 || slot3 > 8) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.slot3 = slot3;
	    }
	    
	    public void setSlot4(int slot4) {
	    	if (slot4 < 0 || slot4 > 8) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.slot4 = slot4;
	    }
	}
	
	@Getter
	@AllArgsConstructor
	public static class defaultCombinationDto {
		@NotNull
	    private int id;
		@Setter
		private CombinationDto combination; 
	    private int roomType;

	    public void setRoomType(int roomType) {
	        if (roomType != 0 && roomType != 1) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.roomType = roomType;
	    }
	}
	
	@Getter
	@AllArgsConstructor
	public static class updateDefaultCombinationDto {
		@NotNull
	    private int id;
		@Setter
		private CombinationDto combination; 
	}
	
	// DB에서 넘어오는 정보를 담을 객체이므로 별도의 유효성 검사 생략
	@Data
	public static class DeviceGroupInfoDto {
		private int deviceId;
		private int groupId;
		private String adminId;
	}

}
