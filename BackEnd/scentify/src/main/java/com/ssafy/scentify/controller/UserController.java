package com.ssafy.scentify.controller;

import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.ssafy.scentify.service.*;
import com.ssafy.scentify.util.CodeProvider;
import com.ssafy.scentify.model.dto.UserDto;
import com.ssafy.scentify.model.entity.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RequestMapping("/v1/user")
@RestController
public class UserController {
	
	private final UserService userService;
	private final EmailService emailService;
	private final CodeProvider codeProvider;
	
	// 영어 및 숫자 (메일에 허용되는 특수기호) + @ + 영어 및 숫자 + . + 영어 허용
	static final String emailRegex = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; 
    static final Pattern emailpattern = Pattern.compile(emailRegex);
    
    // 영어 대소문자 중 1개, 숫자 중 1개, 특수문자 중 1개, 9글자 이상
    static final String passwordRegex = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=:<>?])[A-Za-z0-9!@#$%^&*()_+\\-=:<>?]{9,}$";
    static final Pattern passwordPattern = Pattern.compile(passwordRegex);
	
	public UserController(UserService userService, EmailService emailService, CodeProvider codeProvider) {
		this.userService = userService;
		this.emailService = emailService;
		this.codeProvider = codeProvider;
	}
	
	// API 1번 : id 중복 검사
	@PostMapping("/check-id")
	public ResponseEntity<?> checkDuplicateId(@RequestBody Map<String, String> idMap, HttpServletRequest request) {
	    try {
	        // 입력값에서 id 추출
	        String id = idMap.get("id");
	        if (id == null || id.equals("") || id.contains(" ")) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // id가 없거나 빈 값일 경우
	        }

	        // id 중복 여부 확인
	        if (userService.selectUserById(id)) {
	            return new ResponseEntity<>(HttpStatus.CONFLICT); // 중복된 id
	        }

	        // 세션에 id 저장
	        HttpSession session = request.getSession();
	        session.setAttribute("id", id);

	        return new ResponseEntity<>(HttpStatus.OK); // 성공적으로 처리됨
	    } catch (Exception e) {
	        // 예기치 않은 에러 처리
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}
	
	// API 2번 : email 중복확인 후 인증 코드 전송
	@PostMapping("/email/send-code")
	public ResponseEntity<?> sendEmailCode(@RequestBody Map<String, String> emailMap, HttpServletRequest request) {
		try {
			// 입력값에서 이메일 추출
			String email = emailMap.get("email");
			if (email == null || email.equals("") || !emailpattern.matcher(email).matches() || email.contains(" ")) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // email가 없거나 빈 값/ 형식에 맞지 않을 경우
	        }
			
			// email 중복 여부 확인
			if (userService.selectUserByEmail(email)) {
	            return new ResponseEntity<>(HttpStatus.CONFLICT); // 중복된 email
	        }
	        
	        // 8자리 인증 코드 생성
	        String verifyCode = codeProvider.generateVerificationCode();
	        emailService.sendVerificationEmail(email, verifyCode);
	        
	        // 세션에 email과 발송 인증코드 저장
	        HttpSession session = request.getSession(false);
	        if (session == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			session.setAttribute("email", email);
			session.setAttribute("verifyCode", verifyCode);
	        
			return new ResponseEntity<>(HttpStatus.OK); // 성공적으로 처리됨
		} catch (Exception e) {
			e.printStackTrace();
			
			// 예기치 않은 에러 처리
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 3번 : 인증 코드 검증
	@PostMapping("/email/verify-code")
	public ResponseEntity<?> verifyEmailCode(@RequestBody Map<String, String> inputCodeMap, HttpServletRequest request) {
		try {
			// 입력값에서 코드 추출
			String inputCode = inputCodeMap.get("code");
			if (inputCode == null || inputCode.equals("") || inputCode.length() != 8 || inputCode.contains(" ") ){
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // code가 없거나 빈 값/ 형식에 맞지 않을 경우
	        }
			
			// 세션에 저장된 인증코드와 비교
			HttpSession session = request.getSession(false);
			if (session == null || session.getAttribute("verifyCode") == null || session.getAttribute("verifyCode").equals("")) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			String verifyCode = (String) session.getAttribute("verifyCode");
			if (!inputCode.equals(verifyCode)) new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // 인증코드와 일치하지 않음
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			
			// 예기치 않은 예외 처리
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 4번 : 회원가입
	@PostMapping("/regist")
	public ResponseEntity<?> registerUser(@RequestBody @Valid User user, HttpServletRequest request) {
		try {
			HttpSession session = request.getSession(false);
			if (session == null || session.getAttribute("id").equals("") 
					|| session.getAttribute("id") == null || !user.getId().equals(session.getAttribute("id"))) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			// if (session.getAttribute("email").equals("") || session.getAttribute("email") == null
			//		|| !user.getEmail().equals(session.getAttribute("email"))) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			
			if(!passwordPattern.matcher(user.getPassword()).matches()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			if (!userService.createUser(user)) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			session.invalidate();
			
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 11번 : 로그인
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody UserDto.LoginDto loginDto) {
		try {
			userService.login(loginDto);
			
			
			return new ResponseEntity<>(HttpStatus.OK);
		
		} catch (Exception e) {
			e.printStackTrace();
			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
}
