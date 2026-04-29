package com.covid19.covid_19_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "worldometer_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorldometerData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "country_region")
    private String countryRegion;

    @Column(name = "continent")
    private String continent;

    @Column(name = "population")
    private Integer population;

    @Column(name = "TotalCases")
    private Integer totalCases;

    @Column(name = "NewCases")
    private Integer newCases;

    @Column(name = "TotalDeaths")
    private Integer totalDeaths;

    @Column(name = "NewDeaths")
    private Integer newDeaths;

    @Column(name = "TotalRecovered")
    private Integer totalRecovered;

    @Column(name = "NewRecovered")
    private Integer newRecovered;

    @Column(name = "ActiveCases")
    private Integer activeCases;

    @Column(name = "serious_critical")
    private Integer seriousCritical;

    @Column(name = "total_cases_per_one_million")
    private Integer totalCasesPerOneMillion;

    @Column(name = "deaths_per_one_million")
    private Double deathsPerOneMillion;

    @Column(name = "total_tests")
    private Integer totalTests;

    @Column(name = "tests_per_one_million")
    private Integer testsPerOneMillion;

    @Column(name = "who_region")
    private String whoRegion;
}