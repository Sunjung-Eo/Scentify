package com.ssafy.scentify.favorite.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class ImageGenerationResponse {
    private long created;
    private List<ImageData> data; 
    
    @Getter
    @Setter
    public static class ImageData {
        private String url;
    }
}
