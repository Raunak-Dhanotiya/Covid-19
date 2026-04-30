package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.FullGrouped;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FullGroupedRepository extends JpaRepository<FullGrouped, Long> {
    
    @Query("SELECT f FROM FullGrouped f WHERE (:dangerZone = false OR (f.confirmed > 0 AND (f.deaths * 100.0 / f.confirmed) >= 70.0))")
    Page<FullGrouped> findAllWithDangerZone(@Param("dangerZone") boolean dangerZone, Pageable pageable);

    @Query("SELECT f FROM FullGrouped f WHERE f.countryRegion ILIKE %:keyword% AND (:dangerZone = false OR (f.confirmed > 0 AND (f.deaths * 100.0 / f.confirmed) >= 70.0))")
    Page<FullGrouped> searchWithDangerZone(@Param("keyword") String keyword, @Param("dangerZone") boolean dangerZone, Pageable pageable);
}
