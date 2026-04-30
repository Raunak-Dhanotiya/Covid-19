package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.Covid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CovidRepository extends JpaRepository<Covid, Long> {
    
    @Query("SELECT c FROM Covid c WHERE (:dangerZone = false OR (c.confirmed > 0 AND (c.deaths * 100.0 / c.confirmed) >= 70.0))")
    Page<Covid> findAllWithDangerZone(@Param("dangerZone") boolean dangerZone, Pageable pageable);

    @Query("SELECT c FROM Covid c WHERE c.countryRegion ILIKE %:keyword% AND (:dangerZone = false OR (c.confirmed > 0 AND (c.deaths * 100.0 / c.confirmed) >= 70.0))")
    Page<Covid> searchWithDangerZone(@Param("keyword") String keyword, @Param("dangerZone") boolean dangerZone, Pageable pageable);
}
