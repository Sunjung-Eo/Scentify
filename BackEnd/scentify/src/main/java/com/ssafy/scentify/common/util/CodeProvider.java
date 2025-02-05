package com.ssafy.scentify.common.util;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;
import org.springframework.stereotype.Component;

@Component
public class CodeProvider {
	
	// 8자리 인증코드 생성
	 public String generateVerificationCode() {
	        Random random = new Random();
	        StringBuilder key = new StringBuilder();

	        for (int i = 0; i < 8; i++) {
	            int index = random.nextInt(3);
	            switch (index) {
	                case 0:
	                    key.append((char) (random.nextInt(26) + 97)); // 소문자
	                    break;
	                case 1:
	                    key.append((char) (random.nextInt(26) + 65)); // 대문자
	                    break;
	                case 2:
	                    key.append(random.nextInt(10)); // 숫자
	                    break;
            }
        }
        return key.toString();
    }
	 
	 // 요일 비트 값 반환
	 public int getCurrentDayBit() {
	    ZoneId seoulZone = ZoneId.of("Asia/Seoul");  // 한국 시간대 설정
	    LocalDate koreaDate = LocalDate.now(seoulZone); // 한국 기준 날짜 가져오기
	    int dayOfWeek = koreaDate.getDayOfWeek().getValue(); // 1=월요일, 7=일요일

	    int[] dayBits = {1, 64, 32, 16, 8, 4, 2}; // 일~토 순서
	    return dayBits[dayOfWeek % 7]; // 비트 값 반환
	}
}
