package com.ssafy.scentify.combination.model.entity;

import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Combination {
    private Integer id;
    private String name;
    private Integer choice1;
    private Integer choice1Count;
    private Integer choice2;
    private Integer choice2Count;
    private Integer choice3;
    private Integer choice3Count;
    private Integer choice4;
    private Integer choice4Count;
    private String imageUrl;
}
