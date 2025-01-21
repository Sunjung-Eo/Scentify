package com.ssafy.scentify.model.repository;

import org.apache.ibatis.annotations.*;
import com.ssafy.scentify.model.entity.User;

@Mapper
public interface UserRepository {

    // ID 존재 여부 확인
    @Select("SELECT COUNT(*) > 0 FROM user WHERE id = #{id}")
    boolean existsById(String id);

    // 이메일 존재 여부 확인
    @Select("SELECT COUNT(*) > 0 FROM user WHERE email = #{email}")
    boolean existsByEmail(String email);
}
