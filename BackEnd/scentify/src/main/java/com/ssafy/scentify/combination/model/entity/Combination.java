package com.ssafy.scentify.combination.model.entity;

import java.util.UUID;

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
    
    public void setId() {
        this.id = UUID.randomUUID().hashCode() & Integer.MAX_VALUE;
    }

    public void setName(String name) {
        if ((name != null && name.isBlank()) || (name != null && name.length() > 15)) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.name = name;
    }

    public void setChoice1(Integer choice1) {
        if (choice1 == null || choice1 < 0 || choice1 > 8) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.choice1 = choice1;
    }

    public void setChoice1Count(Integer choice1Count) {
        this.choice1Count = choice1Count;
    }

    public void setChoice2(Integer choice2) {
        if (choice2 != null && (choice2 < 0 || choice2 > 8)) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.choice2 = choice2;
    }

    public void setChoice2Count(Integer choice2Count) {
        this.choice2Count = choice2Count;
    }

    public void setChoice3(Integer choice3) {
        if (choice3 != null && (choice3 < 0 || choice3 > 8)) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.choice3 = choice3;
    }

    public void setChoice3Count(Integer choice3Count) {
        this.choice3Count = choice3Count;
    }

    public void setChoice4(Integer choice4) {
        if (choice4 != null && (choice4 < 0 || choice4 > 8)) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.choice4 = choice4;
    }

    public void setChoice4Count(Integer choice4Count) {
        this.choice4Count = choice4Count;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
