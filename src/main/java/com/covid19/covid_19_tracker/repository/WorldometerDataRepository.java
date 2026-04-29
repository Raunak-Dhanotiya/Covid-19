package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.WorldometerData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorldometerDataRepository extends JpaRepository<WorldometerData, Long> {
	Page<WorldometerData> findByCountryRegionContainingIgnoreCase(String country, Pageable pageable);
}