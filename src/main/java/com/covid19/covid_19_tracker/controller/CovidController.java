package com.covid19.covid_19_tracker.controller;

import com.covid19.covid_19_tracker.entity.Covid;
import com.covid19.covid_19_tracker.service.CovidService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/covid")
@RequiredArgsConstructor
public class CovidController {

    private final CovidService service;

    @GetMapping
    public Page<Covid> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "confirmed") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return service.getAll(pageable);
    }

    @GetMapping("/search")
    public Page<Covid> search(
            @RequestParam String country,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return service.searchByCountry(country, pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Covid create(@RequestBody Covid data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Covid update(@PathVariable Long id, @RequestBody Covid data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
