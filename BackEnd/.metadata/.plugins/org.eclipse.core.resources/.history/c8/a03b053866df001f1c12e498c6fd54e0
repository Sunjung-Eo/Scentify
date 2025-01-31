package com.ssafy.scentify.common.util;

import java.util.Date;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ssafy.scentify.auth.model.dto.TokenDto;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class TokenProvider implements InitializingBean {
	@Value("${JWT_SECRET_KEY}")
	private String secretKeyPlain;
	private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 30; // 30분
	private final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24; // 1일
	
	private static SecretKey secretKey;
	private final OpenCrypt openCrypt;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		byte[] keyBytes = Decoders.BASE64.decode(secretKeyPlain);
		this.secretKey =Keys.hmacShaKeyFor(keyBytes);	
	}
	
	public TokenProvider(OpenCrypt openCrypt) {
		this.openCrypt = openCrypt;
	}
	
	// 토큰 DTO를 만드는 메서드 
	public TokenDto createJwtToken(String id) {
		Date now = new Date();
		String accessToken =  Jwts.builder()
									.setSubject(id)
									.setIssuedAt(now)
									.setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRATION))
									.signWith(SignatureAlgorithm.HS256, secretKey)
									.compact();
		
		String refreshToken = Jwts.builder()
									.setSubject(id)
				  					.setIssuedAt(now)
				  					.setExpiration(new Date(now.getTime() + REFRESH_TOKEN_EXPIRATION))
				  					.signWith(SignatureAlgorithm.HS256, secretKey)
				  					.compact();
		return TokenDto.builder()
                		.grantType("Bearer")
                		.accessToken(accessToken)
                		.refreshToken(refreshToken)
                		.build();
	}
	
	// access token을 만드는 메서드
	public String createAccessToken(String id) {
		Date now = new Date();
		return Jwts.builder()
					.setSubject(id)
					.setIssuedAt(now)
					.setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRATION))
					.signWith(SignatureAlgorithm.HS256, secretKey)
					.compact();
	}
	
	// access token 쿠키를 만드는 메서드
	public Cookie createAccessTokenCookie(String accessToken) {
        String cookieName = "accessToken";
        String cookieValue = accessToken;
        Cookie cookie = new Cookie(cookieName, cookieValue);
       
        // 쿠키 속성 설정
        cookie.setHttpOnly(true);  
        cookie.setSecure(true); 
        cookie.setPath("/"); 
        cookie.setMaxAge(60 * 30);
        return cookie;
	}
	
	// refresh token 쿠키를 만드는 메서드
	public Cookie createRefreshTokenCookie(String refreshToken) {
        String cookieName = "refreshToken";
        String cookieValue = refreshToken;
        Cookie cookie = new Cookie(cookieName, cookieValue);
       
        // 쿠키 속성 설정
        cookie.setHttpOnly(true);  
        cookie.setSecure(true); 
        cookie.setPath("/"); 
        cookie.setMaxAge(60 * 60 * 24);
        return cookie;
	}
	
	// 토큰을 검증하는 메서드 
	public void validateJwtToken(String token) throws JwtException {
	    Jwts.parserBuilder()
	        .setSigningKey(secretKey)
	        .build()
	        .parseClaimsJws(token);
	}
	
	// 토큰에 있는 사용자 id 정보를 가져오는 메서드
	public String getId(String token) {
		try {
			String userId = Jwts.parserBuilder()
								.setSigningKey(secretKey)
								.build()
								.parseClaimsJws(token)
								.getBody()
								.getSubject();
			log.info("Extracted User ID: {}", userId);
			return userId;
		} catch (ExpiredJwtException e) {
	        return e.getClaims().getSubject();
		}
	} 
	
	// 토큰에 있는 시리얼 정보를 가져오는 메서드
	public String getSerial(String token) {
		try {
			String serial = (String) Jwts.parserBuilder()
		
									  .setSigningKey(secretKey)
									  .build()
									  .parseClaimsJws(token)
									  .getBody()
									  .get("token");
			log.info("Extracted Serial: {}", serial);
			return serial;
		} catch (ExpiredJwtException e) {
	        return (String) e.getClaims().get("token");
		}
	}
	
	// 토큰의 만료 시간 정보를 가져오는 메서드
	public Date getExpiration(String token) {
		try {
			Date expiration = Jwts.parserBuilder()
	                				.setSigningKey(secretKey)
	                				.build()
	                				.parseClaimsJws(token)
	                				.getBody()
	                				.getExpiration();
			return expiration;
		} catch (ExpiredJwtException e) {
	        return e.getClaims().getExpiration();
		}
	}
}
