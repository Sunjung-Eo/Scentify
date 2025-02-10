package com.ssafy.scentify.favorite.model.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentRequest implements Serializable {
    private String comment;
    
    public CommentRequest(String comment) {
        this.comment = comment;
    }
}