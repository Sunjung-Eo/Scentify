package com.ssafy.scentify.user.controller;

import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Pattern;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.ssafy.scentify.user.model.dto.UserDto;
import com.ssafy.scentify.user.model.dto.UserDto.LoginDto;
import com.ssafy.scentify.user.model.dto.UserDto.UserInfoDto;
import com.ssafy.scentify.user.model.entity.User;
import com.ssafy.scentify.user.service.EmailService;
import com.ssafy.scentify.user.service.UserService;
import com.ssafy.scentify.auth.TokenService;
import com.ssafy.scentify.auth.model.dto.TokenDto;
import com.ssafy.scentify.common.util.CodeProvider;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.group.GroupService;
import com.ssafy.scentify.group.model.dto.GroupDto.MemberDto;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@RequestMapping("/v1/user")
@RestController
public class UserController {
	
	private final UserService userService;
	private final EmailService emailService;
	private final GroupService groupService;
	private final TokenService tokenService;
	private final CodeProvider codeProvider;
	private final TokenProvider tokenProvider;
	
	// 영어 및 숫자 (메일에 허용되는 특수기호) + @ + 영어 및 숫자 + . + 영어 허용
	static final String emailRegex = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; 
    static final Pattern emailpattern = Pattern.compile(emailRegex);
    
    // 영어 대소문자 중 1개, 숫자 중 1개, 특수문자 중 1개, 8글자 이상
    static final String passwordRegex = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=:<>?])[A-Za-z0-9!@#$%^&*()_+\\-=:<>?]{8,20}$";
    static final Pattern passwordPattern = Pattern.compile(passwordRegex);

	public UserController(UserService userService, EmailService emailService, GroupService groupService, TokenService tokenService, CodeProvider codeProvider, TokenProvider tokenProvider) {
		this.userService = userService;
		this.emailService = emailService;
		this.groupService = groupService;
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
	        HttpSession session = request.getSession(false);
	        if (session == null) { session = request.getSession(); }
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
	        
	        // 그룹 초대 링크 접속 후 회원 가입인지 검증
            HttpStatus invitationResult = handleGroupInvitation(request, user.getId());
            if (invitationResult == HttpStatus.CONFLICT) {
                // 그룹 멤버가 다 차서 등록하지 못함 (409 상황에서도 가입은 완료됨)
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
	                
            session.invalidate();	        
	        return new ResponseEntity<>(HttpStatus.OK);  // 성공적으로 처리됨
	    } catch (Exception e) {
	    	// 예기치 않은 에러 처리
	        log.error("Exception: ", e);
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}

	
	// API 11번 : 로그인
	@PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDto.LoginDto loginDto, HttpServletRequest request) {
        try {
        	// 로그인 서비스 호출하여 아이디, 비밀번호 검중
        	int status = userService.login(loginDto);
        	
        	// 가입된 계정이 없음
        	if (status == 403) { return new ResponseEntity<>(HttpStatus.FORBIDDEN); }
        	
        	// 입력한 비밀번호가 DB 정보와 다름
            if (status == 401) { return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); }
            
            // 그룹 초대 링크 접속 후 로그인인지 검증
            HttpStatus invitationResult = handleGroupInvitation(request, loginDto.getId());
            if (invitationResult == HttpStatus.CONFLICT) {
                // 그룹 멤버가 다 차서 등록하지 못함
                return new ResponseEntity<>(HttpStatus.CONFLICT);
            }
            
            // 세션이 있다면 만료 시킴
            HttpSession session = request.getSession(false);
            if (session != null) { session.invalidate(); }
            
            // 토큰 생성
            TokenDto tokenDto = tokenProvider.createJwtToken(loginDto.getId());
            
            // 리프레시 토큰 레디스 저장
            tokenService.saveRefreshToken(loginDto.getId(), tokenDto.getRefreshToken());
            
            // 헤더에 access 토큰 및 refresh 토큰 쿠키 삽입 
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", tokenDto.getGrantType() + " " + tokenDto.getAccessToken());
            Cookie refreshTokenCookie = tokenProvider.createRefreshTokenCookie(tokenDto.getRefreshToken());
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
	
	// 초대 링크로 들어온 사용자인지 검사
	private HttpStatus handleGroupInvitation(HttpServletRequest request, String userId) {
	    // 세션 가져오기 (존재하지 않으면 null)
	    HttpSession session = request.getSession(false);
	    
	    // 초대링크로 들어오지 않은 사용자이므로 돌아가서 로그인 로직 수행
	    if (session == null) { return HttpStatus.OK; }

	    Integer groupId = (Integer) session.getAttribute("groupId");
	    Integer deviceId = (Integer) session.getAttribute("deviceId");
	    if (groupId == null && deviceId == null) { return HttpStatus.OK; }
        
	    // 그룹 멤버 업데이트
        String userNickname = userService.getUserNickNameById(userId);
        MemberDto memberDto = new MemberDto(groupId, userId, userNickname);
        
        // 멤버 자리가 꽉 찬 경우 409 반환
        boolean updated = groupService.updateMember(memberDto);
        if (!updated) {
            session.invalidate();
            return HttpStatus.CONFLICT; 
        }

        // 만약 그룹에 해당한 사용자의 대표기기가 아직 설정되어 있지 않다면 그룹 기기로 설정
        userService.updateMainDeviceIdIfNull(userId, deviceId);
	    return HttpStatus.OK;
	}
	
	// API 12번 : 로그아웃
	@PostMapping("/logout")
	 public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        try {
        	// access 토큰에서 id 정보, 만료시간 추출
        	String accessToken = authorizationHeader.substring(7);
            long expiration = tokenProvider.getExpiration(accessToken).getTime();
            String userId = tokenProvider.getId(accessToken);
            
            // 블랙리스트로 등록
            tokenService.addToBlacklist(accessToken, expiration);
            
            // 리프레시 토큰 삭제
            tokenService.deleteRefreshToken(userId);
            
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
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);

	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        
	        // 사용자가 수정하고 싶은 닉네임 
	        String nickname = nicknameMap.get("nickname");
	        
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
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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
	
	// API 62번 : 유저 사진 수정 
	@PostMapping("/img/update")
	public ResponseEntity<?> updateUserImg(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, Integer> imgMap) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Authorization header format");
	        }
	        String token = authorizationHeader.substring(7);
	        
	        Integer imgNum = imgMap.get("imgNum");
	        
	        // 데이터 유효성 검사
	        if (0 > imgNum || imgNum > 8) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }

	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        
	        // DB에서 정보 수정 (정보 수정이 이루어지지 않은 경우 400 반환)
	        if (!userService.updateUserImg(userId, imgNum)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }

			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 63변 : 비밀번호 수정
	@PostMapping("/password/update")
	public ResponseEntity<?> updateUserPassword(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, String> passwordMap, HttpServletRequest request) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        String password = passwordMap.get("password");
	        
	        // 비밀번호가 지정된 패턴을 따르지 않은 경우
	        if (!passwordPattern.matcher(password).matches()) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        
	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        
	        // 비밀번호 검증을 이전에 수행했는지 확인
	        HttpSession session = request.getSession(false);
	        if (session == null || !(Boolean.TRUE.equals(session.getAttribute("validatePassword")))) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        
	        // 비밀번호 재설정
	        if (!userService.updatePassword(userId, password)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // 로직 수행 후 세션 만료
	        session.invalidate();
	        
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 64변 : 비밀번호 검증
	@PostMapping("/password/verify")
	public ResponseEntity<?> validatePassword(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Map<String, String> passwordMap, HttpServletRequest request) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        String password = passwordMap.get("password");
	        
	        // 비밀번호가 지정된 패턴을 따르지 않은 경우
	        if (!passwordPattern.matcher(password).matches()) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
	        
	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        LoginDto loginDto = new LoginDto(userId, password);
	        
	        // DB에서 정보 확인 (입력 비밀번호가 계정에 설정된 값과 다를 경우 401)
	        if (userService.login(loginDto) == 401) { return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); }
	        
	        // 세션에 비밀번호 검증한 것을 저장
	        HttpSession session = request.getSession();
	        session.setAttribute("validatePassword", true);

			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 65변 : 회원 탈퇴
	@PostMapping("/delete")
	public ResponseEntity<?> deleteUserAccount(@RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        // 비밀번호 검증을 이전에 수행했는지 확인
	        HttpSession session = request.getSession(false);
	        if (session == null || !(Boolean.TRUE.equals(session.getAttribute("validatePassword")))) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        
	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        
	        // DB에서 정보 확인 (유저 삭제가 이루어지지 않은 경우 400)
	        if (!userService.deleteUser(userId)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // 로직 수행 후 세션 만료
	        session.invalidate();

			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 69번 : 대표기기 설정
	@PostMapping("/device/set")
	public ResponseEntity<?> setMainDevice(@RequestHeader("Authorization") String authorizationHeader,  @RequestBody Map<String, Integer> deviceIdMap) {
		try {
			// "Bearer " 제거
	        if (!authorizationHeader.startsWith("Bearer ")) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	        }
	        String token = authorizationHeader.substring(7);
	        
	        // 토큰에서 id 추출
	        String userId = tokenProvider.getId(token);
	        
	        // DB에서 정보 업데이트 (로직이 수행되지 않은 경우 400)
	        if (!userService.updateMainDeviceId(userId, deviceIdMap.get("deviceId"))) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 78번 : 비밀번호 수정을 위한 이메일 전송
	@PostMapping("/reset/password/send-code")
	public ResponseEntity<?> sendEmailCodeForPassword(@RequestBody Map<String, String> requestMap, HttpServletRequest request) {
		try {
			// 입력값에서 아이디와 이메일 추출
			String id = requestMap.get("id");
			if (id == null || id.isBlank() || id.contains(" ") || id.length() > 30) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // id가 없거나 빈 값/ 형식에 맞지 않을 경우
	        }
			
			String email = requestMap.get("email");
			if (email == null || email.equals("") || !emailpattern.matcher(email).matches() || email.contains(" ")) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // email가 없거나 빈 값/ 형식에 맞지 않을 경우
	        }
			
			// id에 등록한 이메일과 같은지 확인
			String userEmail = userService.getUserEmailById(id);
			if (!userEmail.equals(email)) {
	            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // 사용자 등록 정보와 일치하지 않는 이메일
	        }
	        
	        // 8자리 인증 코드 생성
	        String verifyCode = codeProvider.generateVerificationCode();
	        emailService.sendVerificationEmail(email, verifyCode);
	        
	        // 세션에 email과 발송 인증코드 저장
	        HttpSession session = request.getSession();
	        session.setAttribute("id", id);
			session.setAttribute("email", email);
			session.setAttribute("verifyCode", verifyCode);
	        
			return new ResponseEntity<>(HttpStatus.OK); // 성공적으로 처리됨
		} catch (Exception e) {
			// 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 79번 : 비밀번호 수정을 위한 이메일 코드 확인
	@PostMapping("/reset/password/verify-code")
	public ResponseEntity<?> verifyEmailCodeForPassword(@RequestBody Map<String, String> inputCodeMap, HttpServletRequest request) {
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
			
			// 세션에 코드 검증 여부를 저장
			session.setAttribute("validateCode", true);
			
			return new ResponseEntity<>(HttpStatus.OK); // 성공적으로 처리됨
		} catch (Exception e) {
			// 예기치 않은 예외 처리
			log.error("Exception: ", e);			
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	// API 80변 : 비밀번호 재설정
	@PostMapping("/reset/password")
	public ResponseEntity<?> resetUserPassword(@RequestBody Map<String, String> requestMap, HttpServletRequest request) {
		try {
			// 세션을 가져옴
			HttpSession session = request.getSession(false);
			
			// 세션이 없거나 세션에 비밀번호 검증 여부가 있는지 확인
			if (session == null || !(Boolean.TRUE.equals(session.getAttribute("validateCode")))) {
		        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		    }
			
			// id 값 추출
			String id = requestMap.get("id");			
			if (id == null || id.isBlank() || id.contains(" ") || id.length() > 30) {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // id가 없거나 빈 값/ 형식에 맞지 않을 경우
	        }
			
			// 세션에 저장한 이메일 검증 id와 요청 id가 같지 않은 경우
			String sessionId = (String) session.getAttribute("id");
			if (sessionId == null || !sessionId.equals(id)) {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
			
			// 비밀번호 값 추출
	        String password = requestMap.get("password");
	        
	        // 비밀번호가 지정된 패턴을 따르지 않은 경우
	        if (!passwordPattern.matcher(password).matches()) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }

	        // 비밀번호 재설정
	        if (!userService.updatePassword(id, password)) { return new ResponseEntity<>(HttpStatus.BAD_REQUEST); }
	        
	        // 로직 수행 후 세션 만료
	        session.invalidate();
	        
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨
		} catch (Exception e) {
			 // 예기치 않은 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
//	// API 81번 : 새로고침 시 Access 토큰 헤더에 삽입
//	@PostMapping("/token/issue")
//	public ResponseEntity<?> isseueAccessToken(@RequestHeader("Authorization") String authorizationHeader) {
//		try {
//			// access 토큰에서 id 정보, 만료시간 추출
//        	String accessToken = authorizationHeader.substring(7);
//            
//            // 응답 헤더 생성
//            HttpHeaders headers = new HttpHeaders();
//           
//            // 응답 헤더에 Access Token 추가
//            headers.add("Authorization", "Bearer " + accessToken);
//			
//            return ResponseEntity.ok().headers(headers).build();   // 성공적으로 처리됨	   
//		} catch (Exception e) {
//			// 예기치 못한 에러 처리
//			log.error("Exception: ", e);
//			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//		}
//	}
}
