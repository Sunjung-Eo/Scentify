package com.ssafy.scentify.favorite.model.entity;

import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {
	@Setter
    private Integer id;
    private String userId;
    private int combinationId;
    
    public void setId(String userId) {
        if (userId.isBlank() || userId.contains(" ") || userId.length() > 30) {
            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
        }
        this.userId = userId;
    }
    
    public void setCombinationId(int combinationId) {
    	if (combinationId < 0) {
    		throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
    	}
    	this.combinationId = combinationId;
    }
}