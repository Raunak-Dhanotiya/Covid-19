package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.CountryWiseLatest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryWiseLatestRepository extends JpaRepository<CountryWiseLatest, Long> {
    Page<CountryWiseLatest> findByCountryRegionContainingIgnoreCase(String keyword, Pageable pageable);
}