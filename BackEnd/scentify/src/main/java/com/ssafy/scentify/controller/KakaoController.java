package com.ssafy.scentify.controller;

import java.io.IOException;
import java.time.LocalTime;

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

import com.ssafy.scentify.model.dto.TokenDto;
import com.ssafy.scentify.model.dto.UserDto.SocialLoginDto;
import com.ssafy.scentify.model.dto.UserDto.SocialRegisterDto;
import com.ssafy.scentify.model.entity.User;
import com.ssafy.scentify.service.KakaoService;
import com.ssafy.scentify.service.TokenService;
import com.ssafy.scentify.service.UserService;
import com.ssafy.scentify.util.TokenProvider;

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
	
	private final UserService userService;
	private final KakaoService kakaoService;
	private final TokenProvider tokenProvider;
	private final TokenService tokenService;

	public KakaoController(UserService userService, KakaoService kakaoService, TokenProvider tokenProvider, TokenService tokenService) {
		this.userService = userService;
		this.kakaoService = kakaoService;
		this.tokenProvider = tokenProvider;
		this.tokenService = tokenService;
	}
	
	// API 5번 : 카카오 로그인
	@GetMapping("/login")
	public void kakaoLogin(HttpServletResponse response) {
		String redirectUrl = "https://kauth.kakao.com/oauth/authorize"
								+ "?client_id=" + kakaoApiKey
								+ "&redirect_uri=" + kakaoRedirectUrl
								+ "&response_type=code";
        try {
			response.sendRedirect(redirectUrl);
		} catch (IOException e) {
			log.error("IOException: ", e);
		}	
	}
	
	// API 6번 : 카카오 콜백 메서드
	@GetMapping("/call-back")
	public void kakaoCallback(@RequestParam("code") String code, HttpServletRequest request, HttpServletResponse response)  {
	    try {
		String[] tokens = kakaoService.getKakaoAccessToken(code);
	    String refreshToken = tokens[0];
	    String accessToken = tokens[1];
	    String[] userInfo = kakaoService.getKakaoUserInfo(accessToken);
	    
		String id = userInfo[0];
		String email = userInfo[1];
		SocialLoginDto existingUserInfo = userService.getUserIdByEmail(email);
		
		//카카오에서 받은 이메일 정보로 가입한 회원이 이미 있는 경우
		if (existingUserInfo != null && existingUserInfo.getSocialType() != 2) {
			response.sendRedirect("http://localhost:3000/login/social?social=false"); 
			return;
		}

	    if (existingUserInfo != null && existingUserInfo.getId().equals(id) ) { 
	    	TokenDto tokenDto = tokenProvider.createJwtToken(existingUserInfo.getId());
            tokenService.saveRefreshToken(existingUserInfo.getId(), tokenDto.getRefreshToken());
            
            Cookie accessTokenCookie = tokenProvider.createCookie(tokenDto.getAccessToken());
            Cookie refreshTokenCookie = tokenProvider.createCookie(tokenDto.getRefreshToken());
            response.addCookie(refreshTokenCookie);
            
			response.sendRedirect("http://localhost:3000/login/social?social=true&status=login");
			return;
	    }
	    
	    HttpSession session =  request.getSession();
	    session.setAttribute("socialType", 2);
	    session.setAttribute("id", id);
		response.sendRedirect("http://localhost:3000/login/social?social=true&status=regist");
	    
	    } catch (Exception e) {
	    	try {
				response.sendRedirect("http://localhost:3000");
				
			} catch (IOException io) {
				log.error("IOException: ", io);
			}
	    } 
	}
	
	// API 7번 : 카카오 회원가입
	@PostMapping("/regist")
	public ResponseEntity<?> kakaoRegist(@RequestBody SocialRegisterDto socialUser, HttpServletRequest request, HttpServletResponse response) {
		try {
			HttpSession session = request.getSession(false);			
			if (session == null) { return new ResponseEntity<>(HttpStatus.FORBIDDEN); }
			
			String id = (String) session.getAttribute("id");
			Integer socialType = (Integer) session.getAttribute("socialType");
			
			User user = new User();
			user.setId(id);
			user.setPassword(socialUser.getPassword());
			user.setNickname(socialUser.getNickname());
			user.setEmail(socialUser.getEmail());
			user.setImgNum(socialUser.getImgNum());
			user.setSocialType(socialType);
			user.setGender(socialUser.getGender());
			user.setBirth(socialUser.getBirth());
			
			userService.createUser(user);
			return new ResponseEntity<>(HttpStatus.OK);
	   
		} catch (Exception e) {
			log.error("Exception: ", e);
			 return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
}
