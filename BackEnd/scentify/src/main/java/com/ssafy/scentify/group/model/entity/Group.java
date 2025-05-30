package com.ssafy.scentify.group.model.entity;

import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Group {
    private Integer id;
    private Integer deviceId;
    private String adminId;
    private String adminNickname;
    private String member1Id;
    private String member1Nickname;
    private String member2Id;
    private String member2Nickname;
    private String member3Id;
    private String member3Nickname;
    private String member4Id;
    private String member4Nickname;
}