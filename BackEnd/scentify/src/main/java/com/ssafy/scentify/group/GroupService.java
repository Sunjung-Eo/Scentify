package com.ssafy.scentify.group;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.group.model.dto.GroupDto.CreateDto;
import com.ssafy.scentify.group.model.dto.GroupDto.memberDto;
import com.ssafy.scentify.group.model.entity.Group;
import com.ssafy.scentify.group.model.repository.GroupRepository;

@Service
public class GroupService {
	
	private final GroupRepository groupRepository;
	
	public GroupService(GroupRepository groupRepository) {
		this.groupRepository = groupRepository;
	}

	public CreateDto createGroup(Integer deviceId, String userId, String nickname) {
		CreateDto createDto = new CreateDto(null, deviceId, userId, nickname);
		if (!groupRepository.createGroup(createDto)) return null;
		return createDto;
	}

	public boolean updateMember(memberDto memberDto) {
		return groupRepository.updateMember(memberDto);
	}

	public Group selectGroupById(Integer groupId) {
		return groupRepository.selectGroupById(groupId);
	}
	
	public boolean deleteGroupById(Integer groupId) {
		return groupRepository.deleteGroupById(groupId);
	}

}
