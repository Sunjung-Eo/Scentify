package com.ssafy.scentify.group;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.group.model.dto.GroupDto.CreateDto;
import com.ssafy.scentify.group.model.dto.GroupDto.MemberDto;
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

	public Group selectGroupById(Integer groupId) {
		return groupRepository.selectGroupById(groupId);
	}
	
	public List<Integer> getDeviceIdByUserId(String userId) {
		return groupRepository.getDeviceIdByUserId(userId);
	}
	

	public Group getGroup(int mainDeviceId) {
		return groupRepository.getGroup(mainDeviceId);
	}

	public boolean updateMember(MemberDto memberDto) {
		return groupRepository.updateMember(memberDto);
	}
	
	public boolean updateGroupAllMemberById(Integer groupId) {
		return groupRepository.updateGroupAllMemberById(groupId);
	}

	public boolean updateGroupMemberById(Integer groupId, String memberPosition) {
		return groupRepository.updateGroupMemberById(groupId, memberPosition);
	}

}
