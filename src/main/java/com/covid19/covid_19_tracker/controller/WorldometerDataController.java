package com.covid19.covid_19_tracker.controller;

import com.covid19.covid_19_tracker.entity.WorldometerData;
import com.covid19.covid_19_tracker.service.WorldometerDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worldometer")
@RequiredArgsConstructor
public class WorldometerDataController {

    private final WorldometerDataService service;

    @GetMapping
    public Page<WorldometerData> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "totalCases") String sortBy,
            @RequestParam(defaultValue = "false") boolean dangerZone
    ) {
        return service.getAll(dangerZone, PageRequest.of(page, size, Sort.by(sortBy)));
    }

    @GetMapping("/search")
    public Page<WorldometerData> search(
            @RequestParam String country,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean dangerZone
    ) {
        return service.searchByCountry(country, dangerZone, PageRequest.of(page, size));
    }

    // ✅ NEW
    @GetMapping("/{id}")
    public WorldometerData getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public WorldometerData create(@RequestBody WorldometerData data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public WorldometerData update(@PathVariable Long id, @RequestBody WorldometerData data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
