package com.covid19.covid_19_tracker.service;

import com.covid19.covid_19_tracker.entity.CountryWiseLatest;
import org.springframework.data.domain.*;

public interface CountryWiseLatestService {
    Page<CountryWiseLatest> getAll(boolean dangerZone, Pageable pageable);
    Page<CountryWiseLatest> search(String keyword, boolean dangerZone, Pageable pageable);
    CountryWiseLatest save(CountryWiseLatest data);
    CountryWiseLatest update(Long id, CountryWiseLatest data);
    void delete(Long id);
}