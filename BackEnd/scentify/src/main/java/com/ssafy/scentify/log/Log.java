package com.ssafy.scentify.log;

import java.sql.*;
import lombok.*;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Log {
    private Integer id;
    private String deviceSerial;
    private String userId;
    private Boolean deviceMode;
    private Integer autoScheduleId;
    private Integer customScheduleId;
    private Timestamp sprayTime;
}
