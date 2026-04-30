package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.DayWise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DayWiseRepository extends JpaRepository<DayWise, Long> {
    
    @Query("SELECT d FROM DayWise d WHERE (:dangerZone = false OR (d.confirmed > 0 AND (d.deaths * 100.0 / d.confirmed) >= 70.0))")
    Page<DayWise> findAllWithDangerZone(@Param("dangerZone") boolean dangerZone, Pageable pageable);

    @Query("SELECT d FROM DayWise d WHERE d.date ILIKE %:keyword% AND (:dangerZone = false OR (d.confirmed > 0 AND (d.deaths * 100.0 / d.confirmed) >= 70.0))")
    Page<DayWise> searchWithDangerZone(@Param("keyword") String keyword, @Param("dangerZone") boolean dangerZone, Pageable pageable);
}
