package com.ssafy.scentify.controller;

import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Pattern;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.ssafy.scentify.service.*;
import com.ssafy.scentify.util.CodeProvider;
import com.ssafy.scentify.util.TokenProvider;
import com.ssafy.scentify.model.dto.TokenDto;
import com.ssafy.scentify.model.dto.UserDto;
import com.ssafy.scentify.model.dto.UserDto.UserInfoDto;
import com.ssafy.scentify.model.entity.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RequestMapping("/v1/user")
@RestController
public class UserController {
	
	private final UserService userService;
	private final EmailService emailService;
	private final TokenService tokenService;
	private final CodeProvider codeProvider;
	private final TokenProvider tokenProvider;
	
	// 영어 및 숫자 (메일에 허용되는 특수기호) + @ + 영어 및 숫자 + . + 영어 허용
	static final String emailRegex = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; 
    static final Pattern emailpattern = Pattern.compile(emailRegex);
    
    // 영어 대소문자 중 1개, 숫자 중 1개, 특수문자 중 1개, 9글자 이상
    static final String passwordRegex = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=:<>?])[A-Za-z0-9!@#$%^&*()_+\\-=:<>?]{9,}$";
    static final Pattern passwordPattern = Pattern.compile(passwordRegex);
	
	public UserController(UserService userService, EmailService emailService, TokenService tokenService, CodeProvider codeProvider, TokenProvider tokenProvider) {
		this.userService = userService;
		this.emailService = emailService;
		this.tokenService = tokenService;
		this.codeProvider = codeProvider;
		this.tokenProvider = tokenProvider;
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
	    	log.error("Exception: ", e);
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
			// 예기치 않은 에러 처리
			log.error("Exception: ", e);
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
			
			return new ResponseEntity<>(HttpStatus.OK); // 성공적으로 처리됨
		} catch (Exception e) {
			// 예기치 않은 예외 처리
			log.error("Exception: ", e);			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 4번: 회원가입 
	@PostMapping("/regist")
	public ResponseEntity<?> registerUser(@RequestBody @Valid User user, HttpServletRequest request) {
	    try {
	        // 현재 사용자의 세션을 가져옴 (세션이 없는 경우 null)
	        HttpSession session = request.getSession(false);

	        // 세션이 없거나 세션에 저장된 사용자 ID와 요청의 ID가 다를 경우
	        if (session == null || session.getAttribute("id").equals("") 
	                || session.getAttribute("id") == null || !user.getId().equals(session.getAttribute("id"))) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }

	        // 세션에 저장된 이메일과 요청의 이메일이 다를 경우
	        if (session.getAttribute("email").equals("") || session.getAttribute("email") == null
	                || !user.getEmail().equals(session.getAttribute("email"))) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }

	        // 비밀번호가 지정된 패턴을 따르지 않은 경우
	        if (!passwordPattern.matcher(user.getPassword()).matches()) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }

	        if (!userService.createUser(user)) { // 사용자 계정 생성
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        
	        session.invalidate(); //세션 무효화
	        
	        return new ResponseEntity<>(HttpStatus.OK);  // 성공적으로 처리됨
	    } catch (Exception e) {
	    	// 예기치 않은 에러 처리
	        log.error("Exception: ", e);
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}

	
	// API 11번 : 로그인
	@PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDto.LoginDto loginDto) {
        try {
        	// 로그인 서비스 호출하여 아이디, 비밀번호 검중
        	int status = userService.login(loginDto);
        	
        	// 가입된 계정이 없음
        	if (status == 403) { return new ResponseEntity<>(HttpStatus.FORBIDDEN); }
        	
        	// 입력한 비밀번호가 DB 정보와 다름
            if (status == 401) { return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); }
            
            // 토큰 생성
            TokenDto tokenDto = tokenProvider.createJwtToken(loginDto.getId());
            tokenService.saveRefreshToken(loginDto.getId(), tokenDto.getRefreshToken());
            
            // 헤더에 access 토큰 및 refresh 토큰 쿠키 삽입 
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", tokenDto.getGrantType() + " " + tokenDto.getAccessToken());
            Cookie refreshTokenCookie = tokenProvider.createCookie(tokenDto.getRefreshToken());
            String cookieHeader = String.format("%s=%s; HttpOnly; Secure; Path=%s; Max-Age=%d",
                refreshTokenCookie.getName(),
                refreshTokenCookie.getValue(),
                refreshTokenCookie.getPath(),
                refreshTokenCookie.getMaxAge()
            );
            headers.add("Set-Cookie", cookieHeader);
            
            return ResponseEntity.ok().headers(headers).build();  // 성공적으로 처리됨
            		
        } catch (Exception e) {
        	// 예기치 않은 예외 처리
        	log.error("Exception: ", e);     
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
	
	// API 12번 : 로그아웃
	@PostMapping("/logout")
	 public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        try {
        	// access 토큰 검증
        	String accessToken = authorizationHeader.substring(7);
        	if (!tokenProvider.vaildateJwtToken(accessToken)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
            long expiration = tokenProvider.getExpiration(accessToken).getTime();
            
            // 블랙리스트로 등록
            tokenService.addToBlacklist(accessToken, expiration);
            
            return new ResponseEntity<>(HttpStatus.OK);  // 성공적으로 처리됨
            
        } catch (Exception e) {
        	// 예기치 않은 예외 처리
        	log.error("Exception: ", e); 
        	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
	
	// API 59번 : 회원 정보 조회 (성별, 생년월일 조회)
	@PostMapping("/info/get")
	public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authorizationHeader) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Authorization header format");
	        }
	        String token = authorizationHeader.substring(7);

	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        
	        // DB에서 정보 조회 후 반환
			UserInfoDto infoDto = userService.getUserInfoById(userId);

			return ResponseEntity.ok(infoDto);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 60번 : 유저 닉네임 수정
	@PostMapping("/nickname/update")
	public ResponseEntity<?> updateUserNickname(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, String> nicknameMap) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Authorization header format");
	        }
	        String token = authorizationHeader.substring(7);

	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        
	        // 사용자가 수정하고 싶은 닉네임 
	        String nickname = nicknameMap.get("nickName");
	        
	        // DB에서 정보 수정 (정보 수정이 이루어지지 않은 경우 400 반환)
	        if (!userService.updateUserNickname(userId, nickname)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }

			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 61번 : 유저 정보 수정 (성별, 생년월일 수정)
	@PostMapping("/info/update")
	public ResponseEntity<?> updateUserInfo(@RequestHeader("Authorization") String authorizationHeader, @RequestBody UserInfoDto userInfoDto) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Authorization header format");
	        }
	        String token = authorizationHeader.substring(7);
	        
	        Integer gender = userInfoDto.getGender();
	        LocalDate birth = userInfoDto.getBirth();
	        
	        // 데이터 유효성 검사
	        if (gender < 0 || gender > 2 || birth.isAfter(LocalDate.now())) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }

	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        
	        // DB에서 정보 수정 (정보 수정이 이루어지지 않은 경우 400 반환)
	        if (!userService.updateUserInfo(userId, userInfoDto)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }

			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
}
