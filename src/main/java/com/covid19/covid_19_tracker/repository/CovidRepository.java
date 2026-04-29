package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.Covid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CovidRepository extends JpaRepository<Covid, Long> {
    Page<Covid> findByCountryRegionContainingIgnoreCase(String country, Pageable pageable);
}

