package com.covid19.covid_19_tracker.repository;

import com.covid19.covid_19_tracker.entity.DayWise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DayWiseRepository extends JpaRepository<DayWise, Long> {
}

