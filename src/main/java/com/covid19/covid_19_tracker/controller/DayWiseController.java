package com.covid19.covid_19_tracker.controller;

import com.covid19.covid_19_tracker.entity.DayWise;
import com.covid19.covid_19_tracker.service.DayWiseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/day-wise")
@RequiredArgsConstructor
public class DayWiseController {

    private final DayWiseService service;

    @GetMapping
    public Page<DayWise> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "false") boolean dangerZone
    ) {
        return service.getAll(dangerZone, PageRequest.of(page, size, Sort.by(sortBy)));
    }

    @GetMapping("/search")
    public Page<DayWise> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "false") boolean dangerZone
    ) {
        return service.search(keyword, dangerZone, PageRequest.of(page, size, Sort.by(sortBy)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DayWise create(@RequestBody DayWise data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DayWise update(@PathVariable Long id, @RequestBody DayWise data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
