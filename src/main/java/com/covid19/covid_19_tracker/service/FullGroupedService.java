package com.covid19.covid_19_tracker.service;

import com.covid19.covid_19_tracker.entity.FullGrouped;
import org.springframework.data.domain.*;

public interface FullGroupedService {
    Page<FullGrouped> getAll(Pageable pageable);
    FullGrouped getById(Long id);
    FullGrouped save(FullGrouped data);
    FullGrouped update(Long id, FullGrouped data);
    void delete(Long id);
}