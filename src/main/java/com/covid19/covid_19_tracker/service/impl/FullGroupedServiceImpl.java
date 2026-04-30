package com.covid19.covid_19_tracker.service.impl;

import com.covid19.covid_19_tracker.entity.FullGrouped;
import com.covid19.covid_19_tracker.repository.FullGroupedRepository;
import com.covid19.covid_19_tracker.service.FullGroupedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FullGroupedServiceImpl implements FullGroupedService {

    private final FullGroupedRepository repository;

    @Override
    public Page<FullGrouped> getAll(boolean dangerZone, Pageable pageable) {
        return repository.findAllWithDangerZone(dangerZone, pageable);
    }

    @Override
    public Page<FullGrouped> search(String keyword, boolean dangerZone, Pageable pageable) {
        return repository.searchWithDangerZone(keyword, dangerZone, pageable);
    }

    @Override
    public FullGrouped getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found with id: " + id));
    }

    @Override
    public FullGrouped save(FullGrouped data) {
        return repository.save(data);
    }

    @Override
    public FullGrouped update(Long id, FullGrouped data) {
        FullGrouped existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found with id: " + id));

        data.setId(existing.getId());
        return repository.save(data);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}