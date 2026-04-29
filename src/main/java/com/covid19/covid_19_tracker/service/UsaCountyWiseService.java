package com.covid19.covid_19_tracker.service;

import com.covid19.covid_19_tracker.entity.UsaCountyWise;
import org.springframework.data.domain.*;

public interface UsaCountyWiseService {

    Page<UsaCountyWise> getAll(Pageable pageable);

    UsaCountyWise getById(Long id);

    UsaCountyWise save(UsaCountyWise data);

    UsaCountyWise update(Long id, UsaCountyWise data);

    void delete(Long id);
}