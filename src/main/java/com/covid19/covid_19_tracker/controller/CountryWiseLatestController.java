package com.covid19.covid_19_tracker.controller;

import com.covid19.covid_19_tracker.entity.CountryWiseLatest;
import com.covid19.covid_19_tracker.service.CountryWiseLatestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/country-wise")
@RequiredArgsConstructor
public class CountryWiseLatestController {

    private final CountryWiseLatestService service;

    @GetMapping
    public Page<CountryWiseLatest> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "confirmed") String sortBy,
            @RequestParam(defaultValue = "false") boolean dangerZone
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return service.getAll(dangerZone, pageable);
    }

    @GetMapping("/search")
    public Page<CountryWiseLatest> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean dangerZone
    ) {
        return service.search(keyword, dangerZone, PageRequest.of(page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CountryWiseLatest create(@RequestBody CountryWiseLatest data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CountryWiseLatest update(@PathVariable Long id, @RequestBody CountryWiseLatest data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
