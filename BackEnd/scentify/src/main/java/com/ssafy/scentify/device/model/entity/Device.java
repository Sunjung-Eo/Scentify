package com.ssafy.scentify.device.model.entity;

import java.util.UUID;
import java.util.regex.Pattern;

import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Device {	
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
	
	@NotNull
    private Integer id;
	@NotBlank
	private String serial;
	@NotBlank
    private String name;
	@NotBlank
	private String adminId;
    private Integer groupId;
    @NotBlank
    private String ipAddress;
    private int roomType;
    private int slot1;
    private Integer slot1RemainingRatio;
    private int slot2;
    private Integer slot2RemainingRatio;
    private int slot3;
    private Integer slot3RemainingRatio;
    private int slot4;
    private Integer slot4RemainingRatio;
    private Boolean mode;
    private Float temperature;
    private Integer humidity;
    private int defaultCombination;
    
    public void setId() {
        this.id = UUID.randomUUID().hashCode() & Integer.MAX_VALUE;
    }

    public void setSerial(String serial) {
        if (serial == null || !serial.matches("[a-zA-Z0-9]{16}")) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.serial = serial;
    }

    public void setName(String name) {
        if (name == null || name.isBlank() || name.length() > 15) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.name = name;
    }

    public void setAdminId(String adminId) {
        if (adminId == null || adminId.isBlank() || adminId.contains(" ") || adminId.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.adminId = adminId;
    }

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

    public void setIpAddress(String ipAddress) {
        if (ipAddress == null || !ipPattern.matcher(ipAddress).matches()) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.ipAddress = ipAddress;
    }

    public void setRoomType(int roomType) {
        if (roomType != 0 && roomType != 1) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.roomType = roomType;
    }

    public void setSlot1(int slot1) {
    	if (slot1 < 0 || slot1 > 2) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.slot1 = slot1;
    }

    public void setSlot1RemainingRatio(Integer slot1RemainingRatio) {
        if (slot1RemainingRatio < 0 || slot1RemainingRatio > 100) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.slot1RemainingRatio = slot1RemainingRatio;
    }

    public void setSlot2(int slot2) {
    	if (slot2 < 3 || slot2 > 5) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.slot2 = slot2;
    }

    public void setSlot2RemainingRatio(Integer slot2RemainingRatio) {
        if (slot2RemainingRatio < 0 || slot2RemainingRatio > 100) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.slot2RemainingRatio = slot2RemainingRatio;
    }

    public void setSlot3(int slot3) {
    	if (slot3 < 0 || slot3 > 8) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.slot3 = slot3;
    }

    public void setSlot3RemainingRatio(Integer slot3RemainingRatio) {
        if (slot3RemainingRatio < 0 || slot3RemainingRatio > 100) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.slot3RemainingRatio = slot3RemainingRatio;
    }

    public void setSlot4(int slot4) {
    	if (slot4 < 0 || slot4 > 8) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.slot4 = slot4;
    }

    public void setSlot4RemainingRatio(Integer slot4RemainingRatio) {
        if (slot4RemainingRatio < 0 || slot4RemainingRatio > 100) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.slot4RemainingRatio = slot4RemainingRatio;
    }

    public void setMode(Boolean mode) {
        this.mode = mode;
    }

    public void setTemperature(Float temperature) {
        if (temperature == null || temperature < -30 || temperature > 50) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.temperature = temperature;
    }

    public void setHumidity(Integer humidity) {
        if (humidity == null || humidity < 0 || humidity > 100) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.humidity = humidity;
    }

    public void setDefaultCombination(int defaultCombination) {
        this.defaultCombination = defaultCombination;
    }
}

