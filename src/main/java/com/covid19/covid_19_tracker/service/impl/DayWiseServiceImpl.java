package com.covid19.covid_19_tracker.service.impl;

import com.covid19.covid_19_tracker.entity.DayWise;
import com.covid19.covid_19_tracker.repository.DayWiseRepository;
import com.covid19.covid_19_tracker.service.DayWiseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DayWiseServiceImpl implements DayWiseService {

    private final DayWiseRepository repository;

    @Override
    public Page<DayWise> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public DayWise save(DayWise data) {
        return repository.save(data);
    }

    @Override
    public DayWise update(Long id, DayWise data) {
        DayWise existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data not found with id: " + id));

        data.setId(existing.getId());
        return repository.save(data);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}