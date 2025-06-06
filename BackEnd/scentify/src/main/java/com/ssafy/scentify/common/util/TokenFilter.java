package com.ssafy.scentify.common.util;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.scentify.auth.TokenService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

import java.io.IOException;
import java.util.Collections;

@Slf4j
@Component
public class TokenFilter extends OncePerRequestFilter {

    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        log.info("Request URI: {}", request.getRequestURI());
        
        if (request.getRequestURI().startsWith("/v1/ws/device")) {
            chain.doFilter(request, response);
            return;
        }
        
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String accessToken = authorizationHeader.substring(7);
            log.info("Access Token: {}", accessToken);
            
            // 블랙리스트 확인
            if (tokenService.isBlacklisted(accessToken)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            try {
                // Access Token 검증
                tokenProvider.validateJwtToken(accessToken);
                String userId = tokenProvider.getId(accessToken);
                Authentication auth = new UsernamePasswordAuthenticationToken(
                        userId, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.info("Authentication set : {}", SecurityContextHolder.getContext().getAuthentication());
                
            } catch (ExpiredJwtException e) {
                log.info("Access Token 만료됨, 재발급 시도");

                // 쿠키에서 Refresh Token 추출
                String refreshToken = getRefreshTokenFromCookies(request.getCookies());

                if (refreshToken != null) {
                    try {
                        // Refresh Token 검증
                        tokenProvider.validateJwtToken(refreshToken);
                        String userId = tokenProvider.getId(refreshToken);

                        // Redis에서 Refresh Token 조회 및 검증
                        if (tokenService.validateRefreshToken(userId, refreshToken)) {
                            // 새로운 Access Token 생성
                            String newAccessToken = tokenProvider.createAccessToken(userId);

                            // 응답 헤더에 새로운 Access Token 추가
                            response.setHeader("Authorization", "Bearer " + newAccessToken);

                            // SecurityContext에 인증 정보 설정
                            Authentication newAuth = new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                            SecurityContextHolder.getContext().setAuthentication(newAuth);
                            log.info("Access Token 재발급 + Authentication set : {}", SecurityContextHolder.getContext().getAuthentication());
                            
                        } else {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            log.error("만료된 혹은 올바르지 않은 Refresh Token");
                            return;
                        }
                    } catch (JwtException ex) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        log.error("만료된 Refresh Token: {}", ex.getMessage());
                        return;
                    }
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    log.error("Refresh Token을 찾을 수 없음");
                    return;
                }
            } catch (JwtException e) {
                log.error("만료된 Access Token: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }
        
        chain.doFilter(request, response);
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
}
