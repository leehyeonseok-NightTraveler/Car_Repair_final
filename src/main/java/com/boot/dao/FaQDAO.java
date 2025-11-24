package com.boot.dao;

import java.util.ArrayList;
import java.util.HashMap;

import com.boot.dto.FaQDTO;

public interface FaQDAO {
	public ArrayList<FaQDTO> list();
	public FaQDTO contentView(int faq_no);

	public void writeFaq(HashMap<String, String> param);
	public void modifyFaq(HashMap<String, String> param);
	public void deleteFaq(HashMap<String, String> param);
	public void updateViewCount(int faq_no);
}






















