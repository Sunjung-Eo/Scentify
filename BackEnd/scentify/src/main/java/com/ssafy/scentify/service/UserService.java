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

	public User selectUserById(String id) {
	    User user = userRepository.selectUserById(id);
		return user != null ? user : null;
	}

}
