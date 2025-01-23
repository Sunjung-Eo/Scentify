package com.ssafy.scentify.util;

import java.util.Date;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ssafy.scentify.model.dto.TokenDto;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
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
									.claim("id", id)
									.setIssuedAt(now)
									.setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRATION))
									.signWith(SignatureAlgorithm.HS256, secretKey)
									.compact();
		
		String refreshToken = Jwts.builder()
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

	
	// 토큰을 검증하는 메서드 
	public boolean vaildateJwtToken(String token) {
		try {
			Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	// 토큰에 있는 사용자 id 정보를 가져오는 메서드
	public String getInfo(String token) {
		String useId = Jwts.parserBuilder()
							.setSigningKey(secretKey)
							.build()
							.parseClaimsJws(token)
							.getBody()
							.get("id", String.class);
		return useId;
	}
}
