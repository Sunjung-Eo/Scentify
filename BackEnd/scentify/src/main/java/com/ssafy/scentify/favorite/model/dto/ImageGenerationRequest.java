package com.ssafy.scentify.favorite.model.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
//OpenAI에 요청할 DTO Format('response_format' 추가하셔도됩니다.)
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