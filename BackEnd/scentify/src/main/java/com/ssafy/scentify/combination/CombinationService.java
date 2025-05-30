package com.ssafy.scentify.combination;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.combination.model.dto.CombinationDto;
import com.ssafy.scentify.combination.model.repository.CombinationRepository;
import com.ssafy.scentify.websocket.model.dto.WebSocketDto.CustomScheduleRequest.Combination;

@Service
public class CombinationService {
	
	private final CombinationRepository combinationRepository;
	
	public CombinationService(CombinationRepository combinationRepository) {
		this.combinationRepository = combinationRepository;
	}

	public Integer createCombination(CombinationDto combination) {
		int combinationId = UUID.randomUUID().hashCode() & Integer.MAX_VALUE;
		if (!combinationRepository.createCombination(combinationId, combination)) return null;
		return combinationId;
	}

	public Integer createAutoCombination(String name, int choice, int count) {
		int combinationId = UUID.randomUUID().hashCode() & Integer.MAX_VALUE;
		if (!combinationRepository.createAutoCombination(combinationId, name, choice, count)) return null;
		return combinationId;
	}

	public CombinationDto getCombinationById(int combinationId) {
		return combinationRepository.getCombinationById(combinationId);
	}
	
	public Combination getSocketCombinationById(Integer combinationId) {
		return combinationRepository.getSocketCombinationById(combinationId);
	}

	public boolean updateCombination(CombinationDto combination) {
		return combinationRepository.updateCombination(combination);
	}

	public boolean updateImgUrl(int combinationId, String imgUrl) {
		return combinationRepository.updateImgeUrl(combinationId, imgUrl);
	}
}
