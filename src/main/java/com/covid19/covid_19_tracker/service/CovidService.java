package com.covid19.covid_19_tracker.service;

import com.covid19.covid_19_tracker.entity.Covid;
import org.springframework.data.domain.*;

public interface CovidService {
    Page<Covid> getAll(boolean dangerZone, Pageable pageable);
    Page<Covid> searchByCountry(String country, boolean dangerZone, Pageable pageable);
    Covid save(Covid data);
    Covid update(Long id, Covid data);
    void delete(Long id);
}