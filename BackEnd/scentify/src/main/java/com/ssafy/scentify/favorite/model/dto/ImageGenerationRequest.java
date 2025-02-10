package com.ssafy.scentify.favorite.model.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ImageGenerationRequest implements Serializable {
    private String prompt;
    private int n;
    private String size;

    @Builder
    public ImageGenerationRequest(String prompt, int n, String size) {
        this.prompt = prompt;
        this.n = n;
        this.size = size;
    }
}