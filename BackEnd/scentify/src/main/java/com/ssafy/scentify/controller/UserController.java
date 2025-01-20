package com.ssafy.scentify.controller;

import jakarta.servlet.http.*;
import lombok.extern.log4j.Log4j2;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.ssafy.scentify.service.*;
import com.ssafy.scentify.model.entity.*;

@Log4j2
@RequestMapping("/v1/user")
@RestController
public class UserController {
	
	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	// API 1번 : id 중복 검사
	@PostMapping("/check-id")
	public ResponseEntity<Void> checkDuplicateId(@RequestBody Map<String, String> idMap, HttpServletRequest request) {
	    try {
	        // 입력값에서 id 추출
	        String id = idMap.get("id");
	        if (id == null || id.isEmpty()) {
	            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // id가 없거나 빈 값일 경우
	        }

	        // id 중복 여부 확인
	        User registedUser = userService.selectUserById(id);
	        if (registedUser != null) {
	            return new ResponseEntity<>(HttpStatus.CONFLICT); // 중복된 id
	        }

	        // 세션에 id 저장
	        HttpSession session = request.getSession();
	        session.setAttribute("id", id);

	        return new ResponseEntity<>(HttpStatus.OK); // 성공적으로 처리됨
	    } catch (Exception e) {
	        // 예기치 않은 에러 처리
	        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	    }
	}

}
