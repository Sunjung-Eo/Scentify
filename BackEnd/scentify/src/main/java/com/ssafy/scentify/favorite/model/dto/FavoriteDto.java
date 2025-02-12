package com.ssafy.scentify.favorite.model.dto;

import java.io.Serializable;
import java.sql.Time;
import java.util.List;

import com.ssafy.scentify.combination.model.dto.CombinationDto;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class FavoriteDto {
	
	@Data
    public static class FavoriteListResponseDto {
    	private List<FavoriteListDto> favorites;
	}
	
	@Data
	public static class FavoriteListDto {
		private int id;
		private CombinationDto combination;
	}
	
	@Data
	public static class ShareCombination {
		CombinationDto combination;
		String S3Url;
		String shareUrl;
	}
	
	@Data
	public static class ReadCombination {
		CombinationDto combination;
		String S3Url;
	}

	@Getter
	@NoArgsConstructor
	public static class ImageGenerationResponse {
	    private long created;
	    private List<ImageData> data; 
	    
	    @Getter
	    @Setter
	    public static class ImageData {
	        private String url;
	    }
	}
	
	@Getter
	@NoArgsConstructor
	public static class ImageGenerationRequest implements Serializable {
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
}
