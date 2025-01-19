-- 스키마 생성
DROP DATABASE IF EXISTS Scentify;
CREATE SCHEMA Scentify DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Scentify;

-- 유저 테이블 생성
CREATE TABLE user (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL UNIQUE,
    img_num INT NOT NULL,
    social_type INT NOT NULL,
    gender INT NOT NULL,
    birth DATE NOT NULL,
    main_device_id VARCHAR(255) DEFAULT NULL
);

-- 유저 보안 정보 테이블 생성
CREATE TABLE userSecuinfo (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,
    salt VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 그룹 테이블 생성
CREATE TABLE `group` (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    admin_id VARCHAR(255) NOT NULL,
    member1 VARCHAR(255),
    member2 VARCHAR(255),
    member3 VARCHAR(255),
    member4 VARCHAR(255),
    FOREIGN KEY (admin_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 디바이스 테이블 생성
CREATE TABLE device (
    id INT NOT NULL PRIMARY KEY,
    serial VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    admin_id VARCHAR(255) NOT NULL,
    group_id INT DEFAULT NULL,
    ip_address VARCHAR(255) NOT NULL,
    room_type INT DEFAULT NULL,
    slot_1 INT DEFAULT NULL,
    slot_1_remainingRatio INT DEFAULT NULL,
    slot_2 INT DEFAULT NULL,
    slot_2_remainingRatio INT DEFAULT NULL,
    slot_3 INT DEFAULT NULL,
    slot_3_remainingRatio INT DEFAULT NULL,
    slot_4 INT DEFAULT NULL,
    slot_4_remainingRatio INT DEFAULT NULL,
    mode BOOLEAN NOT NULL DEFAULT 0,
    temperature INT DEFAULT NULL,
    humidity INT DEFAULT NULL,
    default_combination INT DEFAULT NULL,
    FOREIGN KEY (admin_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `group`(id) ON DELETE SET NULL
);

-- 콤비네이션 테이블 생성
CREATE TABLE combination (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    choice1 INT NOT NULL,
    choice1_count INT NOT NULL,
    choice2 INT DEFAULT NULL,
    choice2_count INT DEFAULT NULL,
    choice3 INT DEFAULT NULL,
    choice3_count INT DEFAULT NULL,
    choice4 INT DEFAULT NULL,
    choice4_count INT DEFAULT NULL,
    img_url VARCHAR(255) DEFAULT NULL
);

-- 찜 기록 테이블 생성
CREATE TABLE favorite (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    combination_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (combination_id) REFERENCES combination(id) ON DELETE CASCADE
);

-- 자동화 스케줄 테이블 생성
CREATE TABLE autoSchedule (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    device_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    combination_id INT NOT NULL,
    sub_mode INT NOT NULL,
    type INT DEFAULT NULL,
    `interval` INT NOT NULL,
    mode_on BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES device(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (combination_id) REFERENCES combination(id) ON DELETE CASCADE
);

-- 커스텀 스케줄 테이블 생성
CREATE TABLE customSchedule (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    device_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    combination_id INT NOT NULL,
    combination_name VARCHAR(255) NOT NULL,
    isFavorite BOOLEAN NOT NULL,
    day INT DEFAULT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    `interval` INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES device(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (combination_id) REFERENCES combination(id) ON DELETE CASCADE
);

-- 로그 테이블 생성
CREATE TABLE log (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    device_serial VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    device_mode BOOLEAN NOT NULL,
    autoSchedule_id INT DEFAULT NULL,
    customSchedule_id INT DEFAULT NULL,
    sprayTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_serial) REFERENCES device(serial) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (autoSchedule_id) REFERENCES autoSchedule(id) ON DELETE SET NULL,
    FOREIGN KEY (customSchedule_id) REFERENCES customSchedule(id) ON DELETE SET NULL
);
