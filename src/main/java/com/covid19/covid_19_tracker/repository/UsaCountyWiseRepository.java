package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.UsaCountyWise;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UsaCountyWiseRepository extends JpaRepository<UsaCountyWise, Long> {
    
    @Query("SELECT u FROM UsaCountyWise u WHERE (:dangerZone = false OR (u.confirmed > 0 AND (u.deaths * 100.0 / u.confirmed) >= 70.0))")
    Page<UsaCountyWise> findAllWithDangerZone(@Param("dangerZone") boolean dangerZone, Pageable pageable);

    @Query("SELECT u FROM UsaCountyWise u WHERE u.provinceState ILIKE %:keyword% AND (:dangerZone = false OR (u.confirmed > 0 AND (u.deaths * 100.0 / u.confirmed) >= 70.0))")
    Page<UsaCountyWise> searchWithDangerZone(@Param("keyword") String keyword, @Param("dangerZone") boolean dangerZone, Pageable pageable);
}
