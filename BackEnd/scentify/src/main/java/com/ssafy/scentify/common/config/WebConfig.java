package com.ssafy.scentify.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/v1/**")
//                .allowedOrigins("http://localhost:5173")
//                .allowedMethods("GET", "POST")  
//                .allowedHeaders("Authorization", "Content-Type")
//                .allowCredentials(true); 
//    }
}

