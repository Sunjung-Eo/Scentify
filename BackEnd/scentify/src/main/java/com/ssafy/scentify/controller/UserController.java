package com.ssafy.scentify.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Log4j2
@RequestMapping("/v1/user")
@RestController
public class UserController {

	public UserController() {
		
	}
	
	@PostMapping("/login")
	public String userLogin(@RequestBody String entity) {
		System.out.println("hello");
		
		return entity;
	}
}
