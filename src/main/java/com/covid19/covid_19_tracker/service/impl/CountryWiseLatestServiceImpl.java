package com.covid19.covid_19_tracker.service.impl;

import com.covid19.covid_19_tracker.entity.CountryWiseLatest;
import com.covid19.covid_19_tracker.repository.CountryWiseLatestRepository;
import com.covid19.covid_19_tracker.service.CountryWiseLatestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CountryWiseLatestServiceImpl implements CountryWiseLatestService {

    private final CountryWiseLatestRepository repository;

    @Override
    public Page<CountryWiseLatest> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public Page<CountryWiseLatest> search(String keyword, Pageable pageable) {
        return repository.findByCountryRegionContainingIgnoreCase(keyword, pageable);
    }

    @Override
    public CountryWiseLatest save(CountryWiseLatest data) {
        return repository.save(data);
    }

    @Override
    public CountryWiseLatest update(Long id, CountryWiseLatest data) {
        data.setId(id);
        return repository.save(data);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}