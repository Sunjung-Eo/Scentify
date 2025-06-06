package com.ssafy.scentify.user.model.dto;

import java.sql.Date;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

public class UserDto {
	
	@Data
	@AllArgsConstructor
	public static class LoginDto {
		@NotBlank 
	    private String id;
		@NotBlank
	    private String password;
	}
	
	@Data
	@AllArgsConstructor
	public static class SocialLoginDto {
		@NotBlank 
	    private String id;
		@NotBlank
	    private int socialType;
	}
	
	@Data
	@AllArgsConstructor
	public static class SocialRegisterDto {
		@NotBlank
	    private String password;
	    @NotBlank
	    private String nickname;    
	    @NotNull
	    private int imgNum;
	    @NotNull
	    private int socialType;
	    @NotNull
	    private int gender;
	    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	    private LocalDate birth;
	}
	
	@Data
	@AllArgsConstructor
	public static class UserInfoDto {
		@NotNull
	    private int gender;
		@NotNull
		@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	    private LocalDate birth;
	}
}
