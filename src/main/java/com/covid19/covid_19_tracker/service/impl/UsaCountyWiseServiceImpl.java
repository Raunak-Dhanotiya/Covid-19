package com.covid19.covid_19_tracker.service.impl;

import com.covid19.covid_19_tracker.entity.UsaCountyWise;
import com.covid19.covid_19_tracker.repository.UsaCountyWiseRepository;
import com.covid19.covid_19_tracker.service.UsaCountyWiseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsaCountyWiseServiceImpl implements UsaCountyWiseService {

    private final UsaCountyWiseRepository repository;

    @Override
    public Page<UsaCountyWise> getAll(boolean dangerZone, Pageable pageable) {
        return repository.findAllWithDangerZone(dangerZone, pageable);
    }

    @Override
    public Page<UsaCountyWise> search(String keyword, boolean dangerZone, Pageable pageable) {
        return repository.searchWithDangerZone(keyword, dangerZone, pageable);
    }

    @Override
    public UsaCountyWise getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found with id: " + id));
    }

    @Override
    public UsaCountyWise save(UsaCountyWise data) {
        return repository.save(data);
    }

    @Override
    public UsaCountyWise update(Long id, UsaCountyWise data) {
        UsaCountyWise existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found with id: " + id));

        data.setId(existing.getId());
        return repository.save(data);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}