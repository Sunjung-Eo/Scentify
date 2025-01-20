package com.ssafy.scentify.model.repository;

import org.apache.ibatis.annotations.*;
import com.ssafy.scentify.model.entity.User;

@Mapper
public interface UserRepository {

	 @Select("SELECT id FROM user WHERE id = #{id}")
	    @Results({
	        @Result(property = "id", column = "id")
	    })
	 User selectUserById(String id);
}
