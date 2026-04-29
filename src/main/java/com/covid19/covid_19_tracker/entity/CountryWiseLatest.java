package com.covid19.covid_19_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "country_wise_latest")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CountryWiseLatest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "country_region")
    private String countryRegion;

    @Column(name = "confirmed")
    private Long confirmed;

    @Column(name = "deaths")
    private Long deaths;

    @Column(name = "recovered")
    private Long recovered;

    @Column(name = "active")
    private Long active;

    @Column(name = "new_cases")
    private Long newCases;

    @Column(name = "new_deaths")
    private Long newDeaths;

    @Column(name = "new_recovered")
    private Long newRecovered;

    @Column(name = "deaths_per_100_cases")
    private Double deathsPer100Cases;

    @Column(name = "recovered_per_100_cases")
    private Double recoveredPer100Cases;

    @Column(name = "deaths_per_100_recovered")
    private Double deathsPer100Recovered;

    @Column(name = "confirmed_last_week")
    private Long confirmedLastWeek;

    @Column(name = "one_week_change")
    private Long oneWeekChange;

    @Column(name = "one_week_percent_increase")
    private Double oneWeekPercentIncrease;

    @Column(name = "who_region")
    private String whoRegion;
}