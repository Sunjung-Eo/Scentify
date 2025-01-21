package com.ssafy.scentify.service;

import org.springframework.stereotype.Service;
import com.ssafy.scentify.model.entity.*;
import com.ssafy.scentify.model.repository.UserRepository;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class UserService {
	
	private final UserRepository userRepository;
	
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public boolean selectUserById(String id) {
		return userRepository.existsById(id) ? true : false;
	}

	public boolean selectUserByEmail(String email) {
		return userRepository.existsByEmail(email) ? true : false;
	}

}
