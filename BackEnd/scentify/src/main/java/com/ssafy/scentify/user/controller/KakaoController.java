package com.ssafy.scentify.user.controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.scentify.auth.TokenService;
import com.ssafy.scentify.common.util.TokenProvider;
import com.ssafy.scentify.group.GroupService;
import com.ssafy.scentify.group.model.dto.GroupDto.MemberDto;
import com.ssafy.scentify.user.model.dto.UserDto.SocialLoginDto;
import com.ssafy.scentify.user.model.dto.UserDto.SocialRegisterDto;
import com.ssafy.scentify.user.model.entity.User;
import com.ssafy.scentify.user.service.KakaoService;
import com.ssafy.scentify.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/v1/auth/kakao")
public class KakaoController {
	
	@Value("${kakao.api-key}")
	private String kakaoApiKey;

	@Value("${kakao.redirect.url}")
	private String kakaoRedirectUrl;
	
	// 영어 대소문자 중 1개, 숫자 중 1개, 특수문자 중 1개, 8글자 이상
	static final String passwordRegex = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=:<>?])[A-Za-z0-9!@#$%^&*()_+\\-=:<>?]{8,20}$";
	static final Pattern passwordPattern = Pattern.compile(passwordRegex);

	private final UserService userService;
	private final KakaoService kakaoService;
	private final GroupService groupService;
	private final TokenProvider tokenProvider;
	private final TokenService tokenService;

	public KakaoController(UserService userService, KakaoService kakaoService, GroupService groupService, TokenProvider tokenProvider, TokenService tokenService) {
		this.userService = userService;
		this.kakaoService = kakaoService;
		this.groupService = groupService;
		this.tokenProvider = tokenProvider;
		this.tokenService = tokenService;
	}
	
	// API 5번 : 카카오 로그인
	@GetMapping("/login")
	public void kakaoLogin(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(false);
		Integer groupId = null;
		Integer deviceId = null;
		
		if (session != null) {
			groupId = (Integer) session.getAttribute("groupId");
		    deviceId = (Integer) session.getAttribute("deviceId");
		}
		
		// 카카오 리다이렉트 주소
		String redirectUrl =  "https://kauth.kakao.com/oauth/authorize"
								+ "?client_id=" + kakaoApiKey
								+ "&redirect_uri=" + kakaoRedirectUrl
								+ "&response_type=code";
		
		if (groupId != null && deviceId != null) {
			String stateValue = groupId + "-" + deviceId;
            stateValue = URLEncoder.encode(stateValue, StandardCharsets.UTF_8);
            redirectUrl += "&state=" + stateValue;
		}
		
        try {
        	// 리다이렉트
			response.sendRedirect(redirectUrl);
		} catch (IOException e) {
			log.error("IOException: ", e);
		}	
	}
	
	// API 6번 : 카카오 콜백 메서드
	@GetMapping("/call-back")
	public void kakaoCallback(@RequestParam("code") String code, @RequestParam(value = "state", required = false) String state, HttpServletRequest request, HttpServletResponse response)  {
	    try {
	    	// 카카오에서 발급받은 토큰
			String[] tokens = kakaoService.getKakaoAccessToken(code);
		    String refreshToken = tokens[0];
		    String accessToken = tokens[1];
		    
		    // 토큰을 이용해서 카카오에서 유저 정보 획득
		    String[] userInfo = kakaoService.getKakaoUserInfo(accessToken);
			String id = userInfo[0];
			String email = userInfo[1];
			System.out.println(email);
			
			// 이메일 중복 확인
			SocialLoginDto existingUserInfo = userService.getUserIdByEmail(email);
			
			// 해당 이메일 정보로 가입한 회원이 이미 있는데 카카오 소셜 회원이 아닌 경우
			if (existingUserInfo != null && existingUserInfo.getSocialType() != 2) {
				response.sendRedirect("https://my-scentify.shop/login/social?social=false&provider=kakao"); 
				return;
			}
			
			// 그룹 초대 링크로 들어온 경우
			Integer groupId = null;
			Integer deviceId = null;
			
			if (state != null && !state.isEmpty()) {
		        String decodedState = URLDecoder.decode(state, StandardCharsets.UTF_8);
		        String[] split = decodedState.split("-");
		        if (split.length == 2) {
		            groupId = Integer.valueOf(split[0]);
		            deviceId = Integer.valueOf(split[1]);
		        }
	        }
			
			// 해당 이메일 정보로 가입한 회원이 있고 아이디도 같은 경우 (소셜 로그인한 경우)
		    if (existingUserInfo != null && existingUserInfo.getId().equals(id) ) { 
		    	boolean updated = true;
		    	
		    	if (groupId != null && deviceId != null) {	
			    	// 그룹 멤버 업데이트
			        String userNickname = userService.getUserNickNameById(id);
			        MemberDto memberDto = new MemberDto(groupId, id, userNickname);
			        
			        // 멤버 자리가 꽉 찬 경우 false 
			        updated = groupService.updateMember(memberDto);

			        // 만약 그룹에 해당한 사용자의 대표기기가 아직 설정되어 있지 않다면 그룹 기기로 설정
			        userService.updateMainDeviceIdIfNull(id, deviceId);
		    	}
	            
		    	// 토큰 발급
		    	refreshToken = tokenProvider.createRefreshToken(existingUserInfo.getId());
		    	
		    	// 리프레시 토큰 레디스 저장
	            tokenService.saveRefreshToken(existingUserInfo.getId(), refreshToken);
	            
	            // 발급한 토큰을 쿠키로 삽입
	            Cookie refreshTokenCookie = tokenProvider.createRefreshTokenCookie(refreshToken);
	            response.addCookie(refreshTokenCookie);
		    	
	            if (!updated) {
	            	response.sendRedirect("https://my-scentify.shop/login/social?social=true&status=login&group=false&id=" + id + "provider=kakao");
	            	return;
	            }
	            
	            response.sendRedirect("https://my-scentify.shop/login/social?social=true&status=login&id=" + id + "&provider=kakao");
				return;
		    }
		    
		    // 가입이 필요한 경우 세션에 정보를 저장해준다
		    HttpSession session =  request.getSession();
		    session.setAttribute("socialType", 2);
		    session.setAttribute("id", id);
		    session.setAttribute("email", email);
		    
		    if (groupId != null && deviceId != null) {
		    	session.setAttribute("groupId", groupId);
		    	session.setAttribute("deviceId", deviceId);
		    }
		    
			response.sendRedirect("https://my-scentify.shop/login/social?social=true&status=regist&email=" + email + "&provider=kakao");
			return;
	    
	    } catch (Exception e) {
	    	try {
	    		// 예기치 못한 에러 발생
				response.sendRedirect("https://my-scentify.shop");			
			} catch (IOException io) {
				log.error("IOException: ", io);
			}
	    } 
	}
	
	// API 71번 : 카카오 로그인 Access 토큰 발급
	@PostMapping("/token/issue")
	public ResponseEntity<?> isseueAccessToken(HttpServletRequest request) {
		try {
			// 쿠키에서 Refresh Token 추출
            String refreshToken = getRefreshTokenFromCookies(request.getCookies());
			
            // Refrsh Token에서 userId 추출
            String userId = tokenProvider.getId(refreshToken);
            
            // 응답 헤더 생성
            HttpHeaders headers = new HttpHeaders();
            
			// Redis에서 Refresh Token 조회 및 검증 (만약 Refresh token이 검증되지 않으면 토큰 발급 생략)
            if (tokenService.validateRefreshToken(userId, refreshToken)) {
                // Access Token 생성
                String accessToken = tokenProvider.createAccessToken(userId);

                // 응답 헤더에 Access Token 추가
                headers.add("Authorization", "Bearer " + accessToken);
            }
			
            return ResponseEntity.ok().headers(headers).build();   // 성공적으로 처리됨	   
		} catch (Exception e) {
			// 예기치 못한 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	private String getRefreshTokenFromCookies(Cookie[] cookies) {
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
	
	// API 7번 : 카카오 회원가입
	@PostMapping("/regist")
	public ResponseEntity<?> registerKakaoUser(@RequestBody SocialRegisterDto socialUser, HttpServletRequest request, HttpServletResponse response) {
		try {
			// 현재 사용자의 세션을 가져옴 (세션이 없는 경우 null)
			HttpSession session = request.getSession(false);			
			
			// 세션이 없는 경우
			if (session == null) { return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); }
			
			// 세션에서 아이디와 소셜 타입 정보 가져옴
			String id = (String) session.getAttribute("id");
			Integer socialType = (Integer) session.getAttribute("socialType");
			String email = (String) session.getAttribute("email");
			
			// 그룹 링크로 접속한 회원가입인 경우 가져옴
			Integer groupId = (Integer) session.getAttribute("groupId");
		    Integer deviceId = (Integer) session.getAttribute("deviceId");
			
			// 정보가 없는 경우
			if (id == null || id.isEmpty() || socialType == null 
					|| email == null || email.isEmpty()) { return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); }
			
			// 비밀번호가 지정된 패턴을 따르지 않은 경우
	        if (!passwordPattern.matcher(socialUser.getPassword()).matches()) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	        }
			
			// 데이터 유효성 검사
			User user = new User();
			user.setId(id);
			user.setPassword(socialUser.getPassword());
			user.setNickname(socialUser.getNickname());
			user.setEmail(email);
			user.setImgNum(socialUser.getImgNum());
			user.setSocialType(socialType);
			user.setGender(socialUser.getGender());
			user.setBirth(socialUser.getBirth());
			
			// 유저 생성
			userService.createUser(user);
			session.invalidate();
			
			// 그룹 등록 로직
			if (groupId != null && deviceId != null) {
				 // 그룹 멤버 업데이트
		        String userNickname = userService.getUserNickNameById(id);
		        MemberDto memberDto = new MemberDto(groupId, id, userNickname);
		       
		        boolean updated = groupService.updateMember(memberDto);
		        if (!updated) {
		        	 return new ResponseEntity<>(HttpStatus.CONFLICT); 
		        }
		        
		        // 그룹에 해당하는 기기를 대표 기기로 설정
		        userService.updateMainDeviceIdIfNull(id, deviceId);
			}
					
			return new ResponseEntity<>(HttpStatus.OK);   // 성공적으로 처리됨	   
		} catch (Exception e) {
			// 예기치 못한 에러 처리
			log.error("Exception: ", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
