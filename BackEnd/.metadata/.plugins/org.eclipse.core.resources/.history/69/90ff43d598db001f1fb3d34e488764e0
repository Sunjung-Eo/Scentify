package com.ssafy.scentify;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@MapperScan("com.ssafy.scentify.model.repository")
public class ScentifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScentifyApplication.class, args);
	}

}
