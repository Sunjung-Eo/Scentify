package com.ssafy.scentify.util;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.ssafy.scentify.service.TokenService;
import java.io.IOException;
import java.util.Collections;

@Slf4j
@Component
public class TokenFilter extends OncePerRequestFilter {

    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private TokenService tokenService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
    	log.info("Request URI: {}", request.getRequestURI());
    	
    	if (request.getRequestURI().startsWith("/v1/ws")) {
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

            // 토큰 검증
            if (tokenProvider.vaildateJwtToken(accessToken)) {
            	Authentication auth = new UsernamePasswordAuthenticationToken(
                        tokenProvider.getId(accessToken), null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.info("Authentication set in SecurityContextHolder: {}", SecurityContextHolder.getContext().getAuthentication());
            }
        }
        
        chain.doFilter(request, response);
    }
}
