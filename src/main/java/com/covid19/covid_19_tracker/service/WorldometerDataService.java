package com.covid19.covid_19_tracker.service;

import com.covid19.covid_19_tracker.entity.WorldometerData;
import org.springframework.data.domain.*;

public interface WorldometerDataService {
    Page<WorldometerData> getAll(Pageable pageable);
    Page<WorldometerData> searchByCountry(String country, Pageable pageable);
    WorldometerData getById(Long id);
    WorldometerData save(WorldometerData data);
    WorldometerData update(Long id, WorldometerData data);
    void delete(Long id);
}