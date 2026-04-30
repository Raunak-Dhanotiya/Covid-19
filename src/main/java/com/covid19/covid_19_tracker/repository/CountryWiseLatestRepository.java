package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.CountryWiseLatest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CountryWiseLatestRepository extends JpaRepository<CountryWiseLatest, Long> {
    
    @Query("SELECT c FROM CountryWiseLatest c WHERE (:dangerZone = false OR c.deathsPer100Cases >= 70)")
    Page<CountryWiseLatest> findAllWithDangerZone(@Param("dangerZone") boolean dangerZone, Pageable pageable);

    @Query("SELECT c FROM CountryWiseLatest c WHERE c.countryRegion ILIKE %:keyword% AND (:dangerZone = false OR c.deathsPer100Cases >= 70)")
    Page<CountryWiseLatest> searchWithDangerZone(@Param("keyword") String keyword, @Param("dangerZone") boolean dangerZone, Pageable pageable);
}