package com.ssafy.scentify.schedule.model.dto;

import com.ssafy.scentify.combination.model.dto.CombinationDto;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class UpdateModeDto {
	private Schedule exerciseSchedule;
	private boolean exerciseModeChange;
	private boolean exerciseIntervalChange;
	private Schedule restSchedule;
	private boolean restModeChange;
	private boolean restIntervalChange;
	
	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Schedule {
		@Setter
		private int id;
		@Setter
		private int deviceId;
		private int interval;
		@Setter
		private boolean modeOn;
		
		public void setInterval(int interval) {
	        if (interval < 0) {
	            throw new IllegalArgumentException("입력값이 형식에 맞지 않습니다.");
	        }
	        this.interval = interval;
	    }
	}
}
