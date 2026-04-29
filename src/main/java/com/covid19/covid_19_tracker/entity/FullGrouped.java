package com.covid19.covid_19_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "full_grouped")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FullGrouped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private String date;

    @Column(name = "country_region")
    private String countryRegion;

    @Column(name = "confirmed")
    private Integer confirmed;

    @Column(name = "deaths")
    private Integer deaths;

    @Column(name = "recovered")
    private Integer recovered;

    @Column(name = "active")
    private Integer active;

    @Column(name = "new_cases")
    private Integer newCases;

    @Column(name = "new_deaths")
    private Integer newDeaths;

    @Column(name = "new_recovered")
    private Integer newRecovered;

    @Column(name = "who_region")
    private String whoRegion;
}