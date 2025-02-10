package com.ssafy.scentify.favorite.model.dto;

import java.sql.Time;
import java.util.List;

import com.ssafy.scentify.combination.model.dto.CombinationDto;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
}
