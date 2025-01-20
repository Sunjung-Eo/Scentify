package com.ssafy.scentify.model.entity;

import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UserSecuInfo {
    private String userId;
    private String salt;
}