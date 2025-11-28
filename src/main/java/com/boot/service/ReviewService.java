package com.boot.service;

import java.util.List;

import com.boot.dto.ReviewDTO;

public interface ReviewService {
	
	Integer existsByRsvNo(Integer rsvNo);

	int insertReview(ReviewDTO dto, String sessionAccountId);

	int updateReview(ReviewDTO dto, String sessionAccountId);

	List<ReviewDTO> getStoreReviews(String storeId);

	ReviewDTO getReview(Integer reviewNo);
}
