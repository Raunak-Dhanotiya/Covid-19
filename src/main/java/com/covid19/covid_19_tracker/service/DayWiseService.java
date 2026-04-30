package com.covid19.covid_19_tracker.service;

import com.covid19.covid_19_tracker.entity.DayWise;
import org.springframework.data.domain.*;

public interface DayWiseService {
    Page<DayWise> getAll(boolean dangerZone, Pageable pageable);
    Page<DayWise> search(String keyword, boolean dangerZone, Pageable pageable);
    DayWise save(DayWise data);
    DayWise update(Long id, DayWise data);
    void delete(Long id);
}