package com.covid19.covid_19_tracker.controller;

import com.covid19.covid_19_tracker.entity.FullGrouped;
import com.covid19.covid_19_tracker.service.FullGroupedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/full-grouped")
@RequiredArgsConstructor
public class FullGroupedController {

    private final FullGroupedService service;

    @GetMapping
    public Page<FullGrouped> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy
    ) {
        return service.getAll(PageRequest.of(page, size, Sort.by(sortBy)));
    }

    @GetMapping("/{id}")
    public FullGrouped getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public FullGrouped create(@RequestBody FullGrouped data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public FullGrouped update(@PathVariable Long id, @RequestBody FullGrouped data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
