package com.ssafy.scentify.favorite.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
//요청에 대한 응답을 받을 DTO
public class ImageGenerationResponse {

    private long created;
    private List<ImageURL> data;

    @Getter
    @Setter
    public static class ImageURL {
        private String url;
    }
}
