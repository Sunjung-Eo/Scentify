package com.ssafy.scentify.util;

import java.util.Date;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

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
	
	public String createJwtToken(String clientIp) {
		return Jwts.builder()
					.claim("clientIp", clientIp)
					.setIssuedAt(new Date())
					.setExpiration(new Date(System.currentTimeMillis() + 600000))
					.signWith(secretKey, SignatureAlgorithm.HS256)
					.compact();
	}
	
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
	
	public String getInfo(String token) {
		String encryptedClientIp = Jwts.parserBuilder()
										.setSigningKey(secretKey)
										.build()
										.parseClaimsJws(token)
										.getBody()
										.get("clientIp", String.class);
		return encryptedClientIp;
	}
}
