package com.covid19.covid_19_tracker.service.impl;

import com.covid19.covid_19_tracker.entity.Covid;
import com.covid19.covid_19_tracker.repository.CovidRepository;
import com.covid19.covid_19_tracker.service.CovidService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CovidServiceImpl implements CovidService {

    private final CovidRepository repository;

    @Override
    public Page<Covid> getAll(boolean dangerZone, Pageable pageable) {
        return repository.findAllWithDangerZone(dangerZone, pageable);
    }

    @Override
    public Page<Covid> searchByCountry(String country, boolean dangerZone, Pageable pageable) {
        return repository.searchWithDangerZone(country, dangerZone, pageable);
    }

    @Override
    public Covid save(Covid data) {
        return repository.save(data);
    }

    @Override
    public Covid update(Long id, Covid data) {
        Covid existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found with id: " + id));

        data.setId(existing.getId());
        return repository.save(data);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}