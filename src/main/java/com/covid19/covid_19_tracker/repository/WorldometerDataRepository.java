package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.WorldometerData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WorldometerDataRepository extends JpaRepository<WorldometerData, Long> {
	
    @Query("SELECT w FROM WorldometerData w WHERE (:dangerZone = false OR (w.totalCases > 0 AND (w.totalDeaths * 100.0 / w.totalCases) >= 70.0))")
    Page<WorldometerData> findAllWithDangerZone(@Param("dangerZone") boolean dangerZone, Pageable pageable);

    @Query("SELECT w FROM WorldometerData w WHERE w.countryRegion ILIKE %:keyword% AND (:dangerZone = false OR (w.totalCases > 0 AND (w.totalDeaths * 100.0 / w.totalCases) >= 70.0))")
    Page<WorldometerData> searchWithDangerZone(@Param("keyword") String keyword, @Param("dangerZone") boolean dangerZone, Pageable pageable);
}