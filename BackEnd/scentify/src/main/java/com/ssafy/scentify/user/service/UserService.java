package com.ssafy.scentify.user.service;

import java.sql.Date;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.common.util.OpenCrypt;
import com.ssafy.scentify.home.model.dto.HomeDto.UserHomeDto;
import com.ssafy.scentify.user.model.dto.UserDto.LoginDto;
import com.ssafy.scentify.user.model.dto.UserDto.SocialLoginDto;
import com.ssafy.scentify.user.model.dto.UserDto.UserInfoDto;
import com.ssafy.scentify.user.model.entity.User;
import com.ssafy.scentify.user.model.entity.UserSecuInfo;
import com.ssafy.scentify.user.model.repository.UserRepository;
import com.ssafy.scentify.user.model.repository.UserSecuInfoRepository;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class UserService {
	
	private final UserRepository userRepository;
	private final UserSecuInfoRepository secuinfoRepository;
	private final OpenCrypt openCrypt;
	
	public UserService(UserRepository userRepository, UserSecuInfoRepository secuinfoRepository, OpenCrypt openCrypt) {
		this.userRepository = userRepository;
		this.secuinfoRepository = secuinfoRepository;
		this.openCrypt = openCrypt;
	}

	public boolean selectUserById(String id) {
		return userRepository.existsById(id) ? true : false;
	}

	public boolean selectUserByEmail(String email) {
		return userRepository.existsByEmail(email) ? true : false;
	}

	public boolean createUser(User user) {
		String salt = UUID.randomUUID().toString();
		UserSecuInfo secuInfo = new UserSecuInfo(user.getId(), salt);
		
		String secuPassword = openCrypt.byteArrayToHex(openCrypt.getSHA256(user.getPassword(), salt));
		user.setPassword(secuPassword);
		if (!userRepository.createUser(user)) return false;
		if (!secuinfoRepository.createSecuInfo(secuInfo)) return false;
		return true;
	}

	public int login(LoginDto loginDto) {
		if (secuinfoRepository.getSecuInfoById(loginDto.getId()) == null) return 403;
		UserSecuInfo secuInfo = secuinfoRepository.getSecuInfoById(loginDto.getId());
		String salt = secuInfo.getSalt();
		
		String secuPassword = openCrypt.byteArrayToHex(openCrypt.getSHA256(loginDto.getPassword(), salt));
		String userPassword = userRepository.getUserPasswordById(loginDto.getId());
		if (!secuPassword.equals(userPassword)) return 401;	
		return 200;
	}
	
	public SocialLoginDto getUserIdByEmail(String email) {
		return userRepository.getSocialUserInfoByEmail(email);
	}

	public UserInfoDto getUserInfoById(String id) {
		return userRepository.getUserInfoById(id);
	}
	
	public UserHomeDto getUserHomeInfoById(String id) {
		return userRepository.getUserHomeInfoById(id);
	}
	
	public String getUserNickNameById(String id) {
		return userRepository.getUserNickNameById(id);
	}
	
	public String getUserEmailById(String id) {
		return userRepository.getUserEmailById(id);
	}
	
	public Integer getMainDeviceById(String id) {
		return userRepository.getMainDeviceById(id);
	}

	public boolean updateUserNickname(String userId, String nickname) {
		return userRepository.updateUserNickName(userId, nickname) ? true : false;
	}

	public boolean updateUserInfo(String userId, UserInfoDto userInfoDto) {
		Date birth = Date.valueOf(userInfoDto.getBirth());
		return userRepository.updateUserInfo(userId, userInfoDto.getGender(), birth) ? true : false;
	}

	public boolean updateUserImg(String userId, Integer imgNum) {
		return userRepository.updateUserImgNum(userId, imgNum) ? true : false;
	}

	public boolean updatePassword(String userId, String password) {
		String salt = UUID.randomUUID().toString();
		String secuPassword = openCrypt.byteArrayToHex(openCrypt.getSHA256(password, salt));
		
		if (!userRepository.updatePassword(userId, secuPassword)) return false; 
		if (!secuinfoRepository.updateSalt(userId, salt)) return false;
		return true;
	}

	public boolean deleteUser(String userId) {
		return userRepository.deleteUser(userId) ? true : false;
	}

	public boolean updateMainDeviceId(String userId, Integer deviceId) {
		return userRepository.forceUpdateMainDeviceId(userId, deviceId) ? true : false;
	}
	
	public boolean updateMainDeviceIdIfNull(String userId, Integer deviceId) {
		return userRepository.updateMainDeviceId(userId, deviceId);
	}

}
