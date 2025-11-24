package com.boot.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import com.boot.dto.FaQDTO;
import com.boot.dto.Criteria;

@Mapper
public interface PageDAO {
	public ArrayList<FaQDTO> listWithPaging(Criteria cri);
	public int getTotalCount(Criteria cri);
	
}






















