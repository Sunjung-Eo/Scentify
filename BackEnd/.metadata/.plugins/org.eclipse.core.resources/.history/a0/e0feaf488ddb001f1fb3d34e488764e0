package com.ssafy.scentify.util;

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
}
