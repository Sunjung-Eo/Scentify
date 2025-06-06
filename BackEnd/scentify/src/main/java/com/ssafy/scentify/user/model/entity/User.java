package com.ssafy.scentify.user.model.entity;

import java.sql.Date;
import java.time.LocalDate;
import java.util.regex.Pattern;

import com.fasterxml.jackson.annotation.JsonFormat;

import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
	// 영어 및 숫자 (메일에 허용되는 특수기호) + @ + 영어 및 숫자 + . + 영어 허용
    static final String emailRegex = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; 
    static final Pattern emailpattern = Pattern.compile(emailRegex);
    
    @NotBlank
    private String id;
    @NotBlank
    private String password;
    @NotBlank
    private String nickname;   
    @Email @NotBlank
    private String email;   
    @NotNull
    private int imgNum;
    @NotNull
    private int socialType;
    @NotNull
    private int gender;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate birth;
    private Integer mainDeviceId;

    public void setId(String id) {
        if (id == null || id.isBlank() || id.contains(" ") || id.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.id = id;
    }

    public void setPassword(String password) {
        if (password == null || password.isBlank() || password.contains(" ")) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.password = password;
    }

    public void setNickname(String nickname) {
        if (nickname == null || nickname.isBlank() || nickname.contains(" ") || nickname.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.nickname = nickname;
    }

    public void setEmail(String email) {
        if (email == null || !emailpattern.matcher(email).matches()) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.email = email;
    }

    public void setImgNum(int imgNum) {
        if (0 > imgNum || imgNum > 8) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.imgNum = imgNum;
    }

    public void setSocialType(int socialType) {
        if (0 > socialType || socialType > 2) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.socialType = socialType;
    }

    public void setGender(int gender) {
        if (0 > gender || gender > 2) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.gender = gender;
    }

    public void setBirth(LocalDate birth) {
        if (birth == null || birth.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.birth = birth;
    }

    public void setMainDeviceId(Integer mainDeviceId) {
        this.mainDeviceId = mainDeviceId;
    }
}
