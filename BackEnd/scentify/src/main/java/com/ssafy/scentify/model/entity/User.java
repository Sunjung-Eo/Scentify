package com.ssafy.scentify.model.entity;

import java.sql.Date;
import java.time.LocalDate;
import java.util.regex.Pattern;
import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
	// 영어 및 숫자 (메일에 허용되는 특수기호) + @ + 영어 및 숫자 + . + 영어 허용
    static final String emailRegex = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; 
    static final Pattern emailpattern = Pattern.compile(emailRegex);

    private String id;
    private String password;
    private String nickname;
    private String email;
    private Integer imgNum;
    private Integer socialType;
    private Integer gender;
    private Date birth;
    private Integer mainDeviceId;

    @NonNull
    public void setId(String id) {
        if (id == null || id.contains(" ") || id.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.id = id;
    }

    @NonNull
    public void setPassword(String password) {
        if (password == null || password.contains(" ")) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.password = password;
    }

    @NonNull
    public void setNickname(String nickname) {
        if (nickname == null || nickname.contains(" ") || nickname.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.nickname = nickname;
    }

    @NonNull
    public void setEmail(String email) {
        if (email == null || !emailpattern.matcher(email).matches()) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.email = email;
    }

    @NonNull
    public void setImgNum(Integer imgNum) {
        if (imgNum == null || 0 > imgNum || imgNum > 8) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.imgNum = imgNum;
    }

    @NonNull
    public void setSocialType(Integer socialType) {
        if (socialType == null || 0 > socialType || socialType > 2) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.socialType = socialType;
    }

    @NonNull
    public void setGender(Integer gender) {
        if (gender == null || 0 > gender || gender > 2) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.gender = gender;
    }

    @NonNull
    public void setBirth(Date birth) {
        if (birth == null || birth.toLocalDate().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.birth = birth;
    }

    public void setMainDeviceId(Integer mainDeviceId) {
        this.mainDeviceId = mainDeviceId;
    }
}
