package com.ssafy.scentify.util;

import java.util.Date;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

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
	
	// access 토큰을 만드는 메서드 (유효시간 : 30분)
	public String createJwtToken(String id) {
		Date now = new Date();
		return Jwts.builder()
					.claim("id", id)
					.setIssuedAt(new Date())
					.setExpiration(new Date(now.getTime() + 1000 * 60 * 30))
					.signWith(secretKey, SignatureAlgorithm.HS256)
					.compact();
	}
	
	// refresh 토큰을 만드는 메서드
	public String createRefreshToken() {
		Date now = new Date();
		Date validity = new Date(now.getTime() + 1000 * 60 * 60 * 24);
		String refreshToken = Jwts.builder()
								  .setIssuedAt(now)
								  .setExpiration(validity)
								  .signWith(secretKey, SignatureAlgorithm.HS256)
								  .compact();
		return refreshToken;
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
		String encryptedClientIp = Jwts.parserBuilder()
										.setSigningKey(secretKey)
										.build()
										.parseClaimsJws(token)
										.getBody()
										.get("id", String.class);
		return encryptedClientIp;
	}
}
