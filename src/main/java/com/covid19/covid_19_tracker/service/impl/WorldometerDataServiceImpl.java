package com.covid19.covid_19_tracker.service.impl;

import com.covid19.covid_19_tracker.entity.WorldometerData;
import com.covid19.covid_19_tracker.repository.WorldometerDataRepository;
import com.covid19.covid_19_tracker.service.WorldometerDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorldometerDataServiceImpl implements WorldometerDataService {

    private final WorldometerDataRepository repository;

    @Override
    public Page<WorldometerData> getAll(boolean dangerZone, Pageable pageable) {
        return repository.findAllWithDangerZone(dangerZone, pageable);
    }

    @Override
    public Page<WorldometerData> searchByCountry(String country, boolean dangerZone, Pageable pageable) {
        return repository.searchWithDangerZone(country, dangerZone, pageable);
    }

    @Override
    public WorldometerData getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found with id: " + id));
    }

    @Override
    public WorldometerData save(WorldometerData data) {
        return repository.save(data);
    }

    @Override
    public WorldometerData update(Long id, WorldometerData data) {
        WorldometerData existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found with id: " + id));

        data.setId(existing.getId());
        return repository.save(data);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}