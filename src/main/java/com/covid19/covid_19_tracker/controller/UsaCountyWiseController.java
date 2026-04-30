package com.covid19.covid_19_tracker.controller;

import com.covid19.covid_19_tracker.entity.UsaCountyWise;
import com.covid19.covid_19_tracker.service.UsaCountyWiseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usa-county")
@RequiredArgsConstructor
public class UsaCountyWiseController {

    private final UsaCountyWiseService service;

    @GetMapping
    public Page<UsaCountyWise> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "confirmed") String sortBy,
            @RequestParam(defaultValue = "false") boolean dangerZone
    ) {
        return service.getAll(dangerZone, PageRequest.of(page, size, Sort.by(sortBy)));
    }

    @GetMapping("/search")
    public Page<UsaCountyWise> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "confirmed") String sortBy,
            @RequestParam(defaultValue = "false") boolean dangerZone
    ) {
        return service.search(keyword, dangerZone, PageRequest.of(page, size, Sort.by(sortBy)));
    }


    @GetMapping("/{id}")
    public UsaCountyWise getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UsaCountyWise create(@RequestBody UsaCountyWise data) {
        return service.save(data);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UsaCountyWise update(@PathVariable Long id, @RequestBody UsaCountyWise data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
