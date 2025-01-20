package com.ssafy.scentify.model.entity;

import java.sql.Date;
import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String password;
    private String nickname;
    private String phoneNumber;
    private Integer imageNum;
    private Integer socialType;
    private String gender;
    private Date birth;
    private Integer mainDeviceId;
}