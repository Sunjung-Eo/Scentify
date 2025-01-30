package com.ssafy.scentify.combination.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CombinationDto {
	private String name;
    private int choice1; // NOT NULL
    @Setter
    private int choice1Count;
    private Integer choice2; // NULL 허용
    @Setter
    private Integer choice2Count;
    private Integer choice3; // NULL 허용
    @Setter
    private Integer choice3Count;
    private Integer choice4; // NULL 허용
    @Setter
    private Integer choice4Count;
    
    public void setName(String name) {
        if ((name != null && name.isBlank()) || (name != null && name.length() > 15)) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.name = name;
    }

    public void setChoice1(int choice1) {
        if (choice1 < 0 || choice1 > 8) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.choice1 = choice1;
    }

    public void setChoice2(Integer choice2) {
        if (choice2 != null && (choice2 < 0 || choice2 > 8)) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.choice2 = choice2;
    }

    public void setChoice3(Integer choice3) {
        if (choice3 != null && (choice3 < 0 || choice3 > 8)) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.choice3 = choice3;
    }

    public void setChoice4(Integer choice4) {
        if (choice4 != null && (choice4 < 0 || choice4 > 8)) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.choice4 = choice4;
    }

    public int calculateChoiceCountSum() {
        return choice1Count +
               (choice2Count != null ? choice2Count : 0) +
               (choice3Count != null ? choice3Count : 0) +
               (choice4Count != null ? choice4Count : 0);
    }

    public void validateChoiceCountSum(Integer roomType) {
        int sum = calculateChoiceCountSum();
        if (roomType == 0 && sum != 3) {
            throw new IllegalArgumentException("roomType이 0일 때 choiceCount의 합은 3이어야 합니다.");
        }
        if (roomType == 1 && sum != 6) {
            throw new IllegalArgumentException("roomType이 1일 때 choiceCount의 합은 6이어야 합니다.");
        }
    }
}
