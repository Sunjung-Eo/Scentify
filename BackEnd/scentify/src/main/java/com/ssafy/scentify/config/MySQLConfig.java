package com.ssafy.scentify.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@MapperScan("com.ssafy.scentify.model.repository")
@Configuration
public class MySQLConfig {

}
