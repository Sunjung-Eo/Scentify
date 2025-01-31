package com.ssafy.scentify;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@EnableScheduling
@MapperScan("com.ssafy.scentify")
public class ScentifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScentifyApplication.class, args);
	}

}
