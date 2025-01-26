package com.ssafy.scentify.device;

import org.springframework.stereotype.Service;

import com.ssafy.scentify.device.model.repository.DeviceRepository;

@Service
public class DeviceService {
	private final DeviceRepository deviceRepository;
	
	public DeviceService(DeviceRepository deviceRepository) {
		this.deviceRepository = deviceRepository;
	}
	
	public boolean selectDeviceBySerial(String Serial) {
		return deviceRepository.existsBySerial(Serial) ? true : false;
	}
}
